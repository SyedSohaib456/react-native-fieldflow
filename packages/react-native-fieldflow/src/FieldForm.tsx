import React, {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ScrollViewProps,
  type TextInput,
} from 'react-native';

let AnimatedReanimatedView: any;
let useAnimatedKeyboard: any;
let useAnimatedStyle: any;
let isReanimatedAvailable = false;

try {
  const rea = require('react-native-reanimated');
  // Handle different ESM/CJS export artifacts in React Native versions
  AnimatedReanimatedView = rea.default?.View || rea.Animated?.View || rea.View;
  useAnimatedKeyboard = rea.useAnimatedKeyboard;
  useAnimatedStyle = rea.useAnimatedStyle;
  if (AnimatedReanimatedView && useAnimatedKeyboard && useAnimatedStyle) {
    isReanimatedAvailable = true;
  }
} catch (e) {
  // gracefully degrade to Animated.timing if not found
}

const ReanimatedSpacer = ({
  avoidKeyboard,
  offset,
  extraPad,
}: {
  avoidKeyboard: boolean;
  offset: number;
  extraPad: number;
}) => {
  // We can safely call hooks here because this component is only rendered if isReanimatedAvailable = true
  const keyboard = useAnimatedKeyboard();
  const animatedStyle = useAnimatedStyle(() => {
    const kHeight = avoidKeyboard ? keyboard.height.value : 0;
    const finalHeight = Math.max(kHeight + offset, 0);
    return { height: finalHeight + extraPad };
  }, [avoidKeyboard, offset, extraPad]);
  
  const AnimatedView = AnimatedReanimatedView;
  return <AnimatedView style={animatedStyle} />;
};

import { FieldFlowContext } from './context';
import type {
  FieldFormContextValue,
  FieldFormHandle,
  FieldFormProps,
  KeyboardPlatformOs,
} from './types';

const defaultExtraScrollPadding = 50;

function resolveKeyboardVerticalOffset(
  value: FieldFormProps['keyboardVerticalOffset'],
): number {
  if (typeof value === 'function') {
    return value(Platform.OS as KeyboardPlatformOs);
  }
  if (typeof value === 'number') {
    return value;
  }
  return Platform.OS === 'ios' ? 0 : 25;
}

export const FieldForm = forwardRef<FieldFormHandle, FieldFormProps>((props, ref) => {
    const {
      children,
      onSubmit,
      scrollable = true,
      avoidKeyboard = true,
      ScrollViewComponent,
      KeyboardAvoidingViewComponent,
      scrollViewProps,
      keyboardAvoidingViewProps,
      extraScrollPadding = defaultExtraScrollPadding,
      contentContainerStyle,
      applyDefaultScrollContentFlexGrow = true,
      keyboardShouldPersistTaps = 'handled',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = false,
      iosKeyboardAvoidingBehavior = 'padding',
      androidKeyboardAvoidingBehavior = 'height',
      keyboardVerticalOffset,
      keyboardShowEvent,
      keyboardHideEvent,
      enableKeyboardListeners,
      onKeyboardShow,
      onKeyboardHide,
      androidDismissKeyboardOnBackPress = true,
      dismissKeyboardOnSubmit = true,
      dismissKeyboardOnFocusPastLast = true,
      autoScroll = true,
      chainEnabled = true,
      autoReturnKeyType = true,
      dismissKeyboardOnTap = false,
      submitOnLastFieldDone = false,
      scrollViewRef: scrollViewRefProp,
    } = props;

    const fieldsRef = useRef<{ ref: React.MutableRefObject<TextInput | null>; skip?: boolean }[]>([]);
    const internalScrollRef = useRef<ScrollView | null>(null);

    const setMergedScrollRef = useCallback(
      (node: ScrollView | null) => {
        internalScrollRef.current = node;
        if (!scrollViewRefProp) return;
        if (typeof scrollViewRefProp === 'function') {
          scrollViewRefProp(node);
        } else {
          (scrollViewRefProp as React.MutableRefObject<ScrollView | null>).current = node;
        }
      },
      [scrollViewRefProp],
    );

    const register = useCallback((inputRef: React.MutableRefObject<TextInput | null>, skip?: boolean): number => {
      const fields = fieldsRef.current;
      const existingIdx = fields.findIndex(f => f.ref === inputRef);
      if (existingIdx === -1) {
        fields.push({ ref: inputRef, skip });
        return fields.length - 1;
      }
      return existingIdx;
    }, []);

    const unregister = useCallback((inputRef: React.MutableRefObject<TextInput | null>) => {
      const fields = fieldsRef.current;
      const idx = fields.findIndex(f => f.ref === inputRef);
      if (idx > -1) fields.splice(idx, 1);
    }, []);

    const updateField = useCallback((inputRef: React.MutableRefObject<TextInput | null>, skip?: boolean) => {
      const fields = fieldsRef.current;
      const idx = fields.findIndex(f => f.ref === inputRef);
      if (idx > -1) {
        fields[idx].skip = skip;
      }
    }, []);

    const count = useCallback(() => fieldsRef.current.length, []);

    const hasNext = useCallback((currentIndex: number) => {
      const fields = fieldsRef.current;
      for (let i = currentIndex + 1; i < fields.length; i++) {
        if (!fields[i].skip) return true;
      }
      return false;
    }, []);

    const scrollInputIntoView = useCallback(
      (input: TextInput | null, padding?: number) => {
        const scroll = internalScrollRef.current;
        if (!scroll || !input) return;
        const handle = findNodeHandle(input);
        if (!handle) return;
        const pad = padding ?? (typeof extraScrollPadding === 'number' ? extraScrollPadding : 0);

        // Use a small timeout + requestAnimationFrame to ensure the scroll happens 
        // after layout cycles and keyboard animations have started.
        setTimeout(() => {
          requestAnimationFrame(() => {
            scroll.scrollResponderScrollNativeHandleToKeyboard?.(handle, pad, true);
          });
        }, 50);
      },
      [extraScrollPadding],
    );

    const focusNext = useCallback(
      (currentIndex: number) => {
        const fields = fieldsRef.current;
        let nextField = null;
        
        for (let i = currentIndex + 1; i < fields.length; i++) {
          if (!fields[i].skip) {
            nextField = fields[i].ref;
            break;
          }
        }
        
        if (nextField?.current) {
          nextField.current.focus();
          scrollInputIntoView(nextField.current);
        } else if (dismissKeyboardOnFocusPastLast) {
          Keyboard.dismiss();
        }
      },
      [dismissKeyboardOnFocusPastLast, scrollInputIntoView],
    );

    const submitForm = useCallback(() => {
      if (dismissKeyboardOnSubmit) {
        Keyboard.dismiss();
      }
      onSubmit?.();
    }, [dismissKeyboardOnSubmit, onSubmit]);

    useImperativeHandle(
      ref,
      (): FieldFormHandle => ({
        focusNext,
        scrollInputIntoView,
        dismissKeyboard: () => Keyboard.dismiss(),
        getScrollView: () => internalScrollRef.current,
      }),
      [focusNext, scrollInputIntoView],
    );

    useEffect(() => {
      if (Platform.OS !== 'android' || !androidDismissKeyboardOnBackPress) {
        return undefined;
      }
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        Keyboard.dismiss();
        return false;
      });
      return () => sub.remove();
    }, [androidDismissKeyboardOnBackPress]);

    const animatedMargin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const showEvent =
        keyboardShowEvent ?? (Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow');
      const hideEvent =
        keyboardHideEvent ?? (Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide');

      const showSub = Keyboard.addListener(showEvent, e => {
        const h = e.endCoordinates.height;
        const offset = resolveKeyboardVerticalOffset(keyboardVerticalOffset);
        const finalHeight = Math.max(h + offset, 0);

        if (avoidKeyboard && !isReanimatedAvailable) {
          Animated.timing(animatedMargin, {
            toValue: finalHeight,
            duration: e.duration || 250,
            easing: e.easing ? Easing.out(Easing.poly(4)) : Easing.out(Easing.quad), // Standard keyboard easing
            useNativeDriver: false, // margin doesn't support native driver
          }).start();
        }
        onKeyboardShow?.({ height: h, event: e });
      });

      const hideSub = Keyboard.addListener(hideEvent, e => {
        if (!isReanimatedAvailable) {
          Animated.timing(animatedMargin, {
            toValue: 0,
            duration: e?.duration || 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }).start();
        }
        onKeyboardHide?.();
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [
      avoidKeyboard,
      keyboardVerticalOffset,
      keyboardShowEvent,
      keyboardHideEvent,
      onKeyboardShow,
      onKeyboardHide,
    ]);

    const ctx = useMemo(
      (): FieldFormContextValue => ({
        register,
        unregister,
        updateField,
        focusNext,
        scrollInputIntoView,
        submitForm,
        count,
        hasNext,
        autoScroll,
        chainEnabled,
        autoReturnKeyType,
        submitOnLastFieldDone,
      }),
      [
        register,
        unregister,
        updateField,
        focusNext,
        scrollInputIntoView,
        submitForm,
        count,
        hasNext,
        autoScroll,
        chainEnabled,
        autoReturnKeyType,
        submitOnLastFieldDone,
      ],
    );

    const {
      style: scrollStyleFromProps,
      contentContainerStyle: scrollContentFromProps,
      ...scrollRest
    } = scrollViewProps ?? {};

    const {
      style: kavStyleFromProps,
      ...kavRest
    } = keyboardAvoidingViewProps ?? {};

    const mergedContentContainerStyle = [
      applyDefaultScrollContentFlexGrow ? styles.scrollContent : null,
      contentContainerStyle,
      scrollContentFromProps,
    ];

    const kavBehavior =
      Platform.OS === 'ios' ? iosKeyboardAvoidingBehavior : androidKeyboardAvoidingBehavior;
    const kavOffset = resolveKeyboardVerticalOffset(keyboardVerticalOffset);

    const KavComp = KeyboardAvoidingViewComponent ?? KeyboardAvoidingView;

    let content: React.ReactNode = children;

    if (scrollable) {
      const scrollProps: ScrollViewProps = {
        keyboardDismissMode,
        keyboardShouldPersistTaps,
        showsVerticalScrollIndicator,
        style: scrollStyleFromProps,
        contentContainerStyle: mergedContentContainerStyle,
        automaticallyAdjustKeyboardInsets: Platform.OS === 'ios' ? avoidKeyboard : undefined,
        children: (
          <>
            {children}
            {Platform.OS === 'ios' && avoidKeyboard ? (
              <View style={{ height: extraScrollPadding }} />
            ) : isReanimatedAvailable ? (
              <ReanimatedSpacer
                avoidKeyboard={avoidKeyboard}
                offset={kavOffset}
                extraPad={typeof extraScrollPadding === 'number' ? extraScrollPadding : 0}
              />
            ) : (
              <Animated.View style={{ height: Animated.add(extraScrollPadding, animatedMargin) }} />
            )}
          </>
        ),
        ...scrollRest,
      };

      const ScrollTarget = ScrollViewComponent ?? ScrollView;

      content = createElement(ScrollTarget, {
        ...scrollProps,
        ref: setMergedScrollRef,
      } as ScrollViewProps & { ref: typeof setMergedScrollRef });

      if (dismissKeyboardOnTap) {
        content = (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {content}
          </TouchableWithoutFeedback>
        );
      }
    }

    // No outer wrapper needed with internal spacer approach

    return (
      <FieldFlowContext.Provider value={ctx}>{content}</FieldFlowContext.Provider>
    );
});

FieldForm.displayName = 'FieldForm';

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});

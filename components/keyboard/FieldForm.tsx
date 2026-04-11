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
  View,
  type ScrollViewProps,
  type TextInput,
} from 'react-native';

import { FieldFlowContext } from './context';
import type {
  FieldFormContextValue,
  FieldFormHandle,
  FieldFormProps,
  KeyboardPlatformOs,
} from './types';

const defaultExtraScrollPadding = 10;

function resolveKeyboardVerticalOffset(
  value: KeyboardFormProps['keyboardVerticalOffset'],
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
      scrollViewRef: scrollViewRefProp,
    } = props;

    const fieldsRef = useRef<React.MutableRefObject<TextInput | null>[]>([]);
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

    const register = useCallback((inputRef: React.MutableRefObject<TextInput | null>): number => {
      const fields = fieldsRef.current;
      if (!fields.includes(inputRef)) {
        fields.push(inputRef);
      }
      return fields.indexOf(inputRef);
    }, []);

    const unregister = useCallback((inputRef: React.MutableRefObject<TextInput | null>) => {
      const fields = fieldsRef.current;
      const idx = fields.indexOf(inputRef);
      if (idx > -1) fields.splice(idx, 1);
    }, []);

    const count = useCallback(() => fieldsRef.current.length, []);

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
        const next = fields[currentIndex + 1];
        if (next?.current) {
          next.current.focus();
          scrollInputIntoView(next.current);
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

        if (avoidKeyboard) {
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
        Animated.timing(animatedMargin, {
          toValue: 0,
          duration: e?.duration || 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start();
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
        focusNext,
        scrollInputIntoView,
        submitForm,
        count,
      }),
      [register, unregister, focusNext, scrollInputIntoView, submitForm, count],
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
        children: (
          <>
            {children}
            <Animated.View style={{ height: Animated.add(extraScrollPadding, animatedMargin) }} />
          </>
        ),
        ...scrollRest,
      };

      const ScrollTarget = ScrollViewComponent ?? ScrollView;

      content = createElement(ScrollTarget, {
        ...scrollProps,
        ref: setMergedScrollRef,
      } as ScrollViewProps & { ref: typeof setMergedScrollRef });
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

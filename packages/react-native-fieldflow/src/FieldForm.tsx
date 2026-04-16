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
  Dimensions,
  Easing,
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ScrollViewProps,
  type TextInput,
} from 'react-native';

// NOTE: ReanimatedAccessory has been intentionally removed.
// The keyboard accessory view is now animated with a dedicated Animated.timing
// effect (see inside FieldForm) that uses the keyboard event's exact duration
// and curve — giving reliable, smooth animation on both platforms regardless
// of whether Reanimated worklets are compiled.

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
    keyboardAccessoryView,
    keyboardAccessoryViewMode = 'always',
    scrollViewRef: scrollViewRefProp,
    resetScrollOnKeyboardHide = false,
  } = props;

  const fieldsRef = useRef<{ ref: React.MutableRefObject<TextInput | null>; skip?: boolean }[]>([]);
  const internalScrollRef = useRef<ScrollView | null>(null);
  const [accessoryHeight, setAccessoryHeight] = React.useState(0);
  /** Drives bottom padding for accessory when mode is `whenKeyboardOpen` (clears when keyboard closes). */
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  // Ref to the outermost wrapper View — used to measure how far the container
  // bottom sits above the real screen bottom (e.g. tab bar height).
  // The keyboard height from events is always in screen coordinates, so we
  // subtract this offset to get the correct `bottom` value within our View.
  const posRef = useRef<View | null>(null);
  const bottomOffsetRef = useRef(0);
  const handleContainerLayout = useCallback(() => {
    posRef.current?.measureInWindow((_x, _y, _w, _h) => {
      const screenH = Dimensions.get('screen').height;
      bottomOffsetRef.current = Math.max(screenH - (_y + _h), 0);
    });
  }, []);

  const setMergedScrollRef = useCallback(
    (node: ScrollView | null) => {
      const next = node ?? null;
      internalScrollRef.current = next;
      if (!scrollViewRefProp) return;
      try {
        if (typeof scrollViewRefProp === 'function') {
          scrollViewRefProp(next);
        } else {
          (scrollViewRefProp as React.MutableRefObject<ScrollView | null>).current =
            next;
        }
      } catch {
        // Parent passed a read-only / frozen ref (e.g. some RN + Reanimated paths).
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

  // ─── Dedicated accessory animation ────────────────────────────────
  // Animate translateY with useNativeDriver so motion stays on the UI thread.
  // Negative translateY moves the bar up with the keyboard (anchored at bottom: 0).
  //
  // iOS:  keyboardWillShow / keyboardWillHide   (fire before animation starts)
  // Android: keyboardDidShow / keyboardDidHide   (fire after animation)
  // In both cases we use e.duration to match the keyboard's own timing.
  const accessoryTranslateY = useRef(new Animated.Value(0)).current;
  const accessoryOpacity = useRef(
    new Animated.Value(keyboardAccessoryViewMode === 'whenKeyboardOpen' ? 0 : 1)
  ).current;

  const hasKeyboardAccessory =
    keyboardAccessoryView != null && keyboardAccessoryView !== false;

  useEffect(() => {
    if (!hasKeyboardAccessory) return;

    // Always use Will-events on iOS so animation starts in sync;
    // Did-events on Android where Will-events don't exist.
    const accShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const accHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const accShowSub = Keyboard.addListener(accShowEvent, e => {
      const h = e.endCoordinates.height;
      // Use the keyboard's own duration — this is the secret to perfect sync.
      const dur = e.duration || 250;
      // iOS keyboard spring decelerates rapidly and is perceptually "at rest" well
      // before the reported duration ends. Using expoOut (Bezier 0.16,1,0.3,1)
      // means we reach 97% of target at ~35% of duration — our bar is visually
      // settled before the keyboard even starts to slow, eliminating trailing motion.
      const easing = Platform.OS === 'ios'
        ? Easing.bezier(0.16, 1, 0.3, 1)  // expoOut — fast rise, no animation tail
        : Easing.out(Easing.ease);
      // Subtract the container's offset from the real screen bottom (e.g. tab bar
      // height). Keyboard height is in screen coords; our `bottom` prop is in
      // container coords — without this the bar floats above the keyboard by exactly
      // the tab bar height.
      const adjustedH = Math.max(h - bottomOffsetRef.current, 0);

      const animations: Animated.CompositeAnimation[] = [
        Animated.timing(accessoryTranslateY, {
          toValue: -adjustedH,
          duration: dur,
          easing,
          useNativeDriver: true,
        }),
      ];
      if (keyboardAccessoryViewMode === 'whenKeyboardOpen') {
        animations.push(
          Animated.timing(accessoryOpacity, {
            toValue: 1,
            // Fade in quickly at the start of the keyboard animation
            duration: Math.min(dur * 0.25, 80),
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        );
      }
      Animated.parallel(animations).start();
    });

    const accHideSub = Keyboard.addListener(accHideEvent, e => {
      const dur = e?.duration || 250;
      const hideTranslateEasing =
        Platform.OS === 'ios'
          ? Easing.bezier(0.42, 0, 1, 1)
          : Easing.in(Easing.ease);

      if (keyboardAccessoryViewMode === 'always') {
        // Match keyboard dismiss so the toolbar doesn't "float" on its own spring.
        Animated.timing(accessoryTranslateY, {
          toValue: 0,
          duration: dur,
          easing: hideTranslateEasing,
          useNativeDriver: true,
        }).start();
      } else {
        // ── 'whenKeyboardOpen' mode ────────────────────────────────────
        // Bar must disappear while the keyboard is dismissed, so stay
        // timed with the keyboard event duration.
        Animated.parallel([
          Animated.timing(accessoryTranslateY, {
            toValue: 0,
            duration: dur,
            easing: hideTranslateEasing,
            useNativeDriver: true,
          }),
          Animated.timing(accessoryOpacity, {
            toValue: 0,
            duration: Math.min(dur * 0.25, 80),
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

    return () => {
      accShowSub.remove();
      accHideSub.remove();
    };
  }, [
    hasKeyboardAccessory,
    keyboardAccessoryViewMode,
    accessoryTranslateY,
    accessoryOpacity,
  ]);
  // ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const showEvent =
      keyboardShowEvent ?? (Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow');
    const hideEvent =
      keyboardHideEvent ?? (Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide');

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardOpen(true);
      const h = e.endCoordinates.height;
      const offset = resolveKeyboardVerticalOffset(keyboardVerticalOffset);
      const finalHeight = Math.max(h + offset, 0);

      // Scroll bottom spacer (non‑iOS, or iOS when not using the static spacer below).
      // Avoid useAnimatedKeyboard here — it can throw on New Architecture (frozen ref).
      if (avoidKeyboard) {
        if (Platform.OS === 'ios') {
          // Spacer height is fixed on iOS; animating this value still costs JS frames.
          animatedMargin.setValue(0);
        } else {
          Animated.timing(animatedMargin, {
            toValue: finalHeight,
            duration: e.duration || 250,
            easing: Easing.out(Easing.poly(4)),
            useNativeDriver: false,
          }).start();
        }
      }
      onKeyboardShow?.({ height: h, event: e });
    });

    const hideSub = Keyboard.addListener(hideEvent, e => {
      const hideDuration = e?.duration || 250;
      const hideEasing =
        Platform.OS === 'ios'
          ? Easing.bezier(0.42, 0, 1, 1)
          : Easing.out(Easing.cubic);

      const deferAccessoryPadClear =
        Boolean(keyboardAccessoryView) &&
        keyboardAccessoryViewMode === 'whenKeyboardOpen';

      const applyKeyboardClosedLayout = () => {
        if (Platform.OS === 'ios' && deferAccessoryPadClear) {
          LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: Math.min(hideDuration, 280),
          });
        }
        setKeyboardOpen(false);
      };

      if (resetScrollOnKeyboardHide && scrollable) {
        const scroll = internalScrollRef.current;
        if (scroll) {
          // Same frame as keyboard hide — avoids an extra rAF of latency.
          scroll.scrollTo({ x: 0, y: 0, animated: false });
        }
      }

      if (!deferAccessoryPadClear) {
        applyKeyboardClosedLayout();
      }

      if (avoidKeyboard) {
        if (Platform.OS === 'ios') {
          animatedMargin.setValue(0);
          if (deferAccessoryPadClear) {
            applyKeyboardClosedLayout();
          }
        } else {
          Animated.timing(animatedMargin, {
            toValue: 0,
            duration: hideDuration,
            easing: hideEasing,
            useNativeDriver: false,
          }).start(() => {
            if (deferAccessoryPadClear) {
              applyKeyboardClosedLayout();
            }
          });
        }
      } else if (deferAccessoryPadClear) {
        applyKeyboardClosedLayout();
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
    resetScrollOnKeyboardHide,
    scrollable,
    keyboardAccessoryView,
    keyboardAccessoryViewMode,
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

  const useAccessoryBottomPad =
    Boolean(keyboardAccessoryView) &&
    (keyboardAccessoryViewMode === 'always' || keyboardOpen);

  const mergedContentContainerStyle = [
    applyDefaultScrollContentFlexGrow ? styles.scrollContent : null,
    contentContainerStyle,
    scrollContentFromProps,
    useAccessoryBottomPad && accessoryHeight > 0
      ? { paddingBottom: accessoryHeight }
      : null,
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
          ) : (
            <Animated.View
              style={{
                height: Animated.add(
                  typeof extraScrollPadding === 'number' ? extraScrollPadding : 0,
                  animatedMargin,
                ),
              }}
            />
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

  // Wrap everything in a stable View so:
  //  1. The absolute-positioned accessory bar is scoped correctly.
  //  2. measureInWindow (via posRef) can compute the container's offset
  //     from the real screen bottom to account for tab bars etc.
  return (
    <View ref={posRef} style={styles.container} onLayout={handleContainerLayout}>
      <FieldFlowContext.Provider value={ctx}>
        {content}
        {keyboardAccessoryView && (
          // Always use Animated.View here — driven by the dedicated
          // accessoryMargin effect above which uses the keyboard's own
          // duration for frame-accurate sync on both platforms.
          <Animated.View
            style={[
              styles.accessory,
              {
                bottom: 0,
                transform: [{ translateY: accessoryTranslateY }],
              },
              keyboardAccessoryViewMode === 'whenKeyboardOpen'
                ? { opacity: accessoryOpacity }
                : null,
            ]}
            pointerEvents="box-none"
          >
            <View onLayout={(e) => setAccessoryHeight(e.nativeEvent.layout.height)}>
              {keyboardAccessoryView}
            </View>
          </Animated.View>
        )}
      </FieldFlowContext.Provider>
    </View>
  );
});

FieldForm.displayName = 'FieldForm';

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  accessory: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
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

import { FieldFlowContext } from './context';
import type {
  FieldFormContextValue,
  FieldFormHandle,
  FieldFormProps,
  KeyboardPlatformOs,
} from './types';

const defaultExtraScrollPadding = 50;

// If the keyboard height changes by less than this many pixels between two
// consecutive show events (e.g. switching fields that triggers the autofill
// suggestions bar), we skip re-animating the accessory bar entirely.
const KEYBOARD_HEIGHT_CHANGE_THRESHOLD = 60;

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
    // ── Chat mode ──────────────────────────────────────────────────────────
    // When true, the keyboard open animation uses a gentler easing so the
    // chat message list slides up smoothly rather than jumping. This matches
    // the pacing of WhatsApp / iMessage where the conversation content eases
    // up with the keyboard instead of snapping to its final position.
    chatMode = false,
  } = props;

  const fieldsRef = useRef<{
    ref: React.MutableRefObject<TextInput | null>;
    skip?: boolean;
    isAccessoryField?: boolean;
  }[]>([]);
  const internalScrollRef = useRef<ScrollView | null>(null);
  const [accessoryHeight, setAccessoryHeight] = React.useState(0);
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

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
          (scrollViewRefProp as React.MutableRefObject<ScrollView | null>).current = next;
        }
      } catch {
        // Parent passed a read-only / frozen ref (e.g. some RN + Reanimated paths).
      }
    },
    [scrollViewRefProp],
  );

  // ── Field registry ────────────────────────────────────────────────────────

  const register = useCallback((
    inputRef: React.MutableRefObject<TextInput | null>,
    skip?: boolean,
    isAccessoryField?: boolean,
  ): number => {
    const fields = fieldsRef.current;
    const existingIdx = fields.findIndex(f => f.ref === inputRef);
    if (existingIdx === -1) {
      fields.push({ ref: inputRef, skip, isAccessoryField });
      return fields.length - 1;
    }
    return existingIdx;
  }, []);

  const unregister = useCallback((inputRef: React.MutableRefObject<TextInput | null>) => {
    const fields = fieldsRef.current;
    const idx = fields.findIndex(f => f.ref === inputRef);
    if (idx > -1) fields.splice(idx, 1);
  }, []);

  const updateField = useCallback((
    inputRef: React.MutableRefObject<TextInput | null>,
    skip?: boolean,
    isAccessoryField?: boolean,
  ) => {
    const fields = fieldsRef.current;
    const idx = fields.findIndex(f => f.ref === inputRef);
    if (idx > -1) {
      fields[idx].skip = skip;
      fields[idx].isAccessoryField = isAccessoryField;
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
      let nextField: typeof fields[0] | null = null;
      for (let i = currentIndex + 1; i < fields.length; i++) {
        if (!fields[i].skip) {
          nextField = fields[i];
          break;
        }
      }
      if (nextField?.ref.current) {
        nextField.ref.current.focus();
        // isAccessoryField = true means the field lives outside the ScrollView
        // (inside the keyboard accessory view). Calling scrollInputIntoView on
        // these nodes causes "Error measuring text field" warnings because the
        // scroll responder cannot find them in its subtree. Skip it.
        if (!nextField.isAccessoryField) {
          scrollInputIntoView(nextField.ref.current);
        }
      } else if (dismissKeyboardOnFocusPastLast) {
        Keyboard.dismiss();
      }
    },
    [dismissKeyboardOnFocusPastLast, scrollInputIntoView],
  );

  const submitForm = useCallback(() => {
    if (dismissKeyboardOnSubmit) Keyboard.dismiss();
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
    if (Platform.OS !== 'android' || !androidDismissKeyboardOnBackPress) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Keyboard.dismiss();
      return false;
    });
    return () => sub.remove();
  }, [androidDismissKeyboardOnBackPress]);

  const animatedMargin = useRef(new Animated.Value(0)).current;

  // ─── Accessory bar animation ───────────────────────────────────────────────
  //
  // iOS fires keyboardWillShow BEFORE the keyboard animates — perfect sync.
  // Android only fires keyboardDidShow AFTER — too late, causing a visible pop.
  //
  // Android solution — two-phase approach:
  //   Phase 1 — keyboardWillShow (fires on focus, keyboard not yet visible):
  //     Silently setValue the bar to -accessoryHeight so it sits flush at the
  //     bottom of the content area. The keyboard hasn't appeared yet so this
  //     move is completely invisible to the user.
  //   Phase 2 — keyboardDidShow (keyboard fully up):
  //     Animate from -accessoryHeight → -keyboardHeight using the keyboard's
  //     own reported duration + decelerate easing. The bar travels the same
  //     distance the keyboard rose, so it appears to ride up with it.
  //
  // Flicker fix (field switching):
  //   When the user tabs between fields iOS fires keyboardWillShow again with
  //   a slightly different height (e.g. "Passwords" bar adds ~45px). If the
  //   delta is below KEYBOARD_HEIGHT_CHANGE_THRESHOLD we silently setValue
  //   instead of re-animating to avoid the flicker.
  // ──────────────────────────────────────────────────────────────────────────

  const accessoryTranslateY = useRef(new Animated.Value(0)).current;
  const accessoryOpacity = useRef(
    new Animated.Value(keyboardAccessoryViewMode === 'whenKeyboardOpen' ? 0 : 1)
  ).current;
  const lastKeyboardHeightRef = useRef(0);
  const accessoryHeightRef = useRef(0);

  const hasKeyboardAccessory = keyboardAccessoryView != null && keyboardAccessoryView !== false;

  useEffect(() => {
    if (!hasKeyboardAccessory) return;

    const accShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const accHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    // ── Android Phase 1: silent pre-position on focus ──────────────────────
    let androidPreSub: ReturnType<typeof Keyboard.addListener> | null = null;
    if (Platform.OS === 'android') {
      androidPreSub = Keyboard.addListener('keyboardWillShow', () => {
        const barH = accessoryHeightRef.current;
        if (barH > 0) {
          accessoryTranslateY.setValue(-barH);
        }
        if (keyboardAccessoryViewMode === 'whenKeyboardOpen') {
          accessoryOpacity.setValue(0);
        }
      });
    }

    const accShowSub = Keyboard.addListener(accShowEvent, e => {
      const h = e.endCoordinates.height;
      const dur = e.duration || 250;
      const prevH = lastKeyboardHeightRef.current;
      const delta = Math.abs(h - prevH);

      // Flicker fix: small height change = field switch, not keyboard open.
      if (prevH > 0 && delta < KEYBOARD_HEIGHT_CHANGE_THRESHOLD) {
        const adjustedH = Platform.OS === 'ios'
          ? Math.max(h - bottomOffsetRef.current, 0)
          : h;
        accessoryTranslateY.stopAnimation();
        accessoryTranslateY.setValue(-adjustedH);
        lastKeyboardHeightRef.current = h;
        return;
      }

      lastKeyboardHeightRef.current = h;

      if (Platform.OS === 'android') {
        Animated.timing(accessoryTranslateY, {
          toValue: -h,
          duration: dur,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();

        if (keyboardAccessoryViewMode === 'whenKeyboardOpen') {
          Animated.timing(accessoryOpacity, {
            toValue: 1,
            duration: Math.min(dur * 0.3, 100),
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
        return;
      }

      // iOS
      const adjustedH = Math.max(h - bottomOffsetRef.current, 0);
      const animations: Animated.CompositeAnimation[] = [
        Animated.timing(accessoryTranslateY, {
          toValue: -adjustedH,
          duration: dur,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ];
      if (keyboardAccessoryViewMode === 'whenKeyboardOpen') {
        animations.push(
          Animated.timing(accessoryOpacity, {
            toValue: 1,
            duration: Math.min(dur * 0.25, 80),
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        );
      }
      Animated.parallel(animations).start();
    });

    const accHideSub = Keyboard.addListener(accHideEvent, () => {
      lastKeyboardHeightRef.current = 0;

      if (keyboardAccessoryViewMode === 'always') {
        if (Platform.OS === 'android') {
          Animated.timing(accessoryTranslateY, {
            toValue: 0,
            duration: 160,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(accessoryTranslateY, {
            toValue: 0,
            mass: 0.1,
            stiffness: 120,
            damping: 20,
            overshootClamping: true,
            useNativeDriver: true,
          }).start();
        }
      } else {
        if (Platform.OS === 'android') {
          Animated.parallel([
            Animated.timing(accessoryTranslateY, {
              toValue: 0,
              duration: 160,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(accessoryOpacity, {
              toValue: 0,
              duration: 80,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.timing(accessoryTranslateY, {
              toValue: 0,
              duration: 250,
              easing: Easing.bezier(0.42, 0, 1, 1),
              useNativeDriver: true,
            }),
            Animated.timing(accessoryOpacity, {
              toValue: 0,
              duration: 80,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    });

    return () => {
      accShowSub.remove();
      accHideSub.remove();
      androidPreSub?.remove();
    };
  }, [
    hasKeyboardAccessory,
    keyboardAccessoryViewMode,
    accessoryTranslateY,
    accessoryOpacity,
  ]);

  // ─── Main keyboard show/hide (bottom margin for Android avoidance) ─────────
  // ─── Main keyboard show/hide ───────────────────────────────────────────────
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

      if (avoidKeyboard) {
        if (Platform.OS === 'ios') {
          // iOS: automaticallyAdjustKeyboardInsets handles everything.
          animatedMargin.setValue(0);
        } else {
          if (chatMode) {
            // ── chatMode Android: skip the JS-thread height animation entirely.
            // Animating `height` with useNativeDriver:false runs layout on every
            // JS frame — that's the source of "2000 dropped frames" even when
            // the UI thread stays at 120fps. Instead, snap the spacer instantly
            // (one synchronous setValue, zero JS animation loop) and let
            // scrollToEnd provide the smooth motion — it runs on the native thread.
            animatedMargin.setValue(finalHeight);
            internalScrollRef.current?.scrollToEnd({ animated: true });
          } else {
            // Normal (non-chat) forms: animate the spacer so content shifts up
            // with the keyboard. Dropping frames here is acceptable because
            // normal forms don't need 120fps chat-style smoothness.
            Animated.timing(animatedMargin, {
              toValue: finalHeight,
              duration: e.duration || 250,
              easing: Easing.out(Easing.poly(4)),
              useNativeDriver: false,
            }).start();
          }
        }
      }

      // iOS chatMode: inset system settles in ~1 frame, then pin to bottom.
      if (chatMode && Platform.OS === 'ios') {
        setTimeout(() => {
          internalScrollRef.current?.scrollToEnd({ animated: true });
        }, 50);
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
    chatMode,
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
  // ─── Context ───────────────────────────────────────────────────────────────

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

  // ─── Render ────────────────────────────────────────────────────────────────

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

  return (
    <View ref={posRef} style={styles.container} onLayout={handleContainerLayout}>
      <FieldFlowContext.Provider value={ctx}>
        {content}
        {keyboardAccessoryView && (
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
            <View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                setAccessoryHeight(h);
                accessoryHeightRef.current = h;
              }}
            >
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
  scrollContent: { flexGrow: 1 },
  accessory: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
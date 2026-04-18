import type { ComponentType, MutableRefObject, ReactNode, Ref } from "react";
import type {
  KeyboardAvoidingViewProps,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
} from "react-native";

/** Public context API for field registration and chained focus (used by `KeyboardInput`). */
export interface FieldFormContextValue {
  register: (
    inputRef: MutableRefObject<TextInput | null>,
    skip?: boolean,
    isAccessoryField?: boolean,
  ) => number;
  unregister: (inputRef: MutableRefObject<TextInput | null>) => void;
  updateField: (
    inputRef: MutableRefObject<TextInput | null>,
    skip?: boolean,
    isAccessoryField?: boolean,
  ) => void;
  focusNext: (currentIndex: number) => void;
  /** Scrolls the form scroll view to ensure the given input is visible above the keyboard. */
  scrollInputIntoView: (input: TextInput | null, padding?: number) => void;
  submitForm: () => void;
  count: () => number;
  hasNext: (currentIndex: number) => boolean;
  /** @internal settings from FieldForm */
  autoScroll: boolean;
  chainEnabled: boolean;
  autoReturnKeyType: boolean;
  submitOnLastFieldDone: boolean;
}

/** Imperative API when `KeyboardForm` is used with `ref`. */
export interface FieldFormHandle {
  /** Same as context `focusNext` — focuses the next registered field and scrolls if possible. */
  focusNext: (currentIndex: number) => void;
  /** Scrolls the form scroll view so the given input stays above the keyboard (no-op if not scrollable / no ref). */
  scrollInputIntoView: (input: TextInput | null, padding?: number) => void;
  dismissKeyboard: () => void;
  /** Live ref to the scroll surface (internal or your `scrollViewRef`). */
  getScrollView: () => ScrollView | null;
}

/** Matches `Platform.OS` at runtime. */
export type KeyboardPlatformOs =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "web";

export type KeyboardVerticalOffsetResolver = (
  platform: KeyboardPlatformOs,
) => number;

export interface FieldFormProps {
  children: ReactNode;
  /** Called when the last field submits and `submitForm` runs (after optional keyboard dismiss). */
  onSubmit?: () => void;

  /** Wrap content in a vertical `ScrollView`. @default true */
  scrollable?: boolean;
  /** Wrap in `KeyboardAvoidingView`. @default true */
  avoidKeyboard?: boolean;

  /** Automatically scroll to focused inputs. @default true */
  autoScroll?: boolean;
  /** Automatically focus the next field on SubmitEditing (Enter/Next). @default true */
  chainEnabled?: boolean;
  /** Automatically switch return key between "next" and "done". @default true */
  autoReturnKeyType?: boolean;
  /** Tapping outside any input will dismiss the keyboard. @default false */
  dismissKeyboardOnTap?: boolean;
  /**
   * When true, the keyboard open animation uses a gentler easing so the
   * chat message list slides up smoothly rather than jumping. This matches
   * the pacing of WhatsApp / iMessage.
   */
  chatMode?: boolean;
  /**
   * Render a cross-platform view that hovers right above the keyboard consistently
   * on both iOS and Android. It sits at the bottom of the container and moves up
   * when the keyboard is shown. Useful for toolbars or submit buttons.
   */
  keyboardAccessoryView?: ReactNode;

  /**
   * Controls when the `keyboardAccessoryView` is visible:
   * - `'always'` — always visible, floats up when keyboard opens (default)
   * - `'whenKeyboardOpen'` — only visible while the keyboard is shown
   */
  keyboardAccessoryViewMode?: "whenKeyboardOpen" | "always";

  /**
   * Replace the default `ScrollView` (e.g. `KeyboardAwareScrollView`).
   * Must forward `ref` to a scroll view that implements `scrollResponderScrollNativeHandleToKeyboard`.
   */
  ScrollViewComponent?: ComponentType<ScrollViewProps>;
  /** Replace the default RN `KeyboardAvoidingView` if you need a custom implementation. */
  KeyboardAvoidingViewComponent?: ComponentType<KeyboardAvoidingViewProps>;

  /** Spread onto the scroll surface before `contentContainerStyle` merge. */
  scrollViewProps?: ScrollViewProps;
  /** Spread onto `KeyboardAvoidingView`; `style` is merged with the default `flex: 1`. */
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;

  /**
   * Extra bottom padding merged into `contentContainerStyle` (in addition to your own styles).
   * @default 50
   */
  extraScrollPadding?: number;
  /** Merged into `contentContainerStyle` after defaults. */
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  /** When true, merges `{ flexGrow: 1 }` into `contentContainerStyle`. @default true */
  applyDefaultScrollContentFlexGrow?: boolean;

  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
  keyboardDismissMode?: ScrollViewProps["keyboardDismissMode"];
  showsVerticalScrollIndicator?: ScrollViewProps["showsVerticalScrollIndicator"];

  iosKeyboardAvoidingBehavior?: KeyboardAvoidingViewProps["behavior"];
  androidKeyboardAvoidingBehavior?: KeyboardAvoidingViewProps["behavior"];
  /** Static offset or per-platform resolver. Unset uses iOS `0`, Android `25`. */
  keyboardVerticalOffset?: number | KeyboardVerticalOffsetResolver;

  /**
   * Keyboard listeners. If omitted but callbacks are set, listeners still attach.
   * Set `enableKeyboardListeners: false` to disable entirely.
   */
  keyboardShowEvent?: "keyboardWillShow" | "keyboardDidShow";
  keyboardHideEvent?: "keyboardWillHide" | "keyboardDidHide";
  enableKeyboardListeners?: boolean;
  onKeyboardShow?: (payload: { height: number; event: unknown }) => void;
  onKeyboardHide?: () => void;

  /** Android: dismiss keyboard on hardware back without consuming the event. @default true */
  androidDismissKeyboardOnBackPress?: boolean;
  /** When `submitForm` is invoked. @default true */
  dismissKeyboardOnSubmit?: boolean;
  /** When moving past the last field via `focusNext`. @default true */
  dismissKeyboardOnFocusPastLast?: boolean;
  /** Submit the whole form / call `onSubmit` when the "Done" key is pressed on the last field. @default false */
  submitOnLastFieldDone?: boolean;

  /**
   * Use your own ref for the scroll view instead of an internal one
   * (e.g. when `ScrollViewComponent` manages ref externally).
   */
  scrollViewRef?: Ref<ScrollView | null>;

  /**
   * After the keyboard hides, scroll the form `ScrollView` back to the top (`y: 0`).
   * Use for short forms; leave false for long scrollable content.
   * @default false
   */
  resetScrollOnKeyboardHide?: boolean;
}

export interface FieldInputProps extends TextInputProps {
  /** Explicit order when multiple inputs mount out of order. */
  chainIndex?: number;
  /** Runs before `ctx.submitForm()` when this is the last field and user submits. */
  onFormSubmit?: () => void;
  /** Jump here instead of the next registered field. */
  nextRef?: MutableRefObject<TextInput | null>;
  /** Set false to use `KeyboardInput` outside a `KeyboardForm`. @default true */
  registerWithForm?: boolean;
  /** Skip this field during standard keyboard "Next" navigation. @default false */
  skip?: boolean;
  /**
   * When true the field lives inside the keyboard accessory view (outside
   * the ScrollView). Prevents scrollInputIntoView being called on this node,
   * which would cause "Error measuring text field" warnings because the scroll
   * responder cannot find it in its subtree.
   */
  isAccessoryField?: boolean;
}

export type FieldInputSubmitEditingEvent =
  NativeSyntheticEvent<TextInputSubmitEditingEventData>;

export interface UseKeyboardHeightOptions {
  showEvent?: "keyboardWillShow" | "keyboardDidShow";
  hideEvent?: "keyboardWillHide" | "keyboardDidHide";
}

export interface KeyboardHeightPayload {
  height: number;
  event: unknown;
}

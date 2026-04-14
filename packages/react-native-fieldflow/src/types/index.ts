/**
 * react-native-fieldflow — Complete Type Definitions
 * @packageDocumentation
 */

import type { ComponentType, MutableRefObject, ReactElement, ReactNode, RefObject } from 'react';
import type {
  FlatListProps,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  ScrollViewProps,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationRules {
  required?: boolean | string | { value: boolean; message: string };
  min?: number | [number, string] | { value: number; message: string };
  max?: number | [number, string] | { value: number; message: string };
  minLength?: number | [number, string] | { value: number; message: string };
  maxLength?: number | [number, string] | { value: number; message: string };
  pattern?: RegExp | [RegExp, string] | { value: RegExp; message: string };
  email?: boolean | string | { value: boolean; message: string };
  url?: boolean | string | { value: boolean; message: string };
  numeric?: boolean | string | { value: boolean; message: string };
  matches?: string | [string, string] | { value: string; message: string };
  custom?: (value: string, values: Record<string, unknown>) => string | null | Promise<string | null>;
  /** Debounce time in ms for async custom validation. @default 400 */
  debounce?: number;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface FormThemeColors {
  primary: string;
  error: string;
  success: string;
  warning: string;
  placeholder: string;
  label: string;
  text: string;
  border: string;
  borderFocused: string;
  background: string;
  backgroundFocused: string;
  toolbar: string;
  toolbarButton: string;
  toolbarBorder: string;
}

export interface FormThemeSpacing {
  fieldGap: number;
  errorTopMargin: number;
  labelBottomMargin: number;
}

/** User-facing theme (all properties optional for overrides) */
export interface FormTheme {
  colors?: Partial<FormThemeColors>;
  borderRadius?: number;
  inputHeight?: number;
  fontSize?: number;
  fontFamily?: string;
  errorFontSize?: number;
  labelFontSize?: number;
  animationDuration?: number;
  hapticStyle?: HapticStyle;
  spacing?: Partial<FormThemeSpacing>;
}

/** Internal resolved theme (all properties required after merge) */
export interface ResolvedFormTheme {
  colors: FormThemeColors;
  borderRadius: number;
  inputHeight: number;
  fontSize: number;
  fontFamily: string | undefined;
  errorFontSize: number;
  labelFontSize: number;
  animationDuration: number;
  spacing: FormThemeSpacing;
  hapticStyle: HapticStyle;
}

// ─── Haptics ──────────────────────────────────────────────────────────────────

export type HapticStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

export interface HapticConfig {
  onFocus?: HapticStyle | false;
  onError?: HapticStyle | false;
  onSuccess?: HapticStyle | false;
}

// ─── Field State ──────────────────────────────────────────────────────────────

export interface FieldState {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
  focused: boolean;
}

export interface FieldRegistration {
  name: string;
  ref: MutableRefObject<any>;
  rules?: ValidationRules;
  label?: string;
  type: FieldType;
  order: number;
}

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'phone'
  | 'otp'
  | 'amount'
  | 'select'
  | 'date'
  | 'tags'
  | 'search';

// ─── Form State (Zustand Store) ──────────────────────────────────────────────

export interface FormStoreState {
  // Values
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  validating: Record<string, boolean>;

  // Form-level state
  isSubmitting: boolean;
  submitCount: number;
  isDirty: boolean;

  // Focus chain
  fields: FieldRegistration[];
  focusedField: string | null;

  // Actions
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Record<string, unknown>) => void;
  getValue: (name: string) => unknown;
  getValues: () => Record<string, unknown>;

  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  getError: (name: string) => string | null;
  getErrors: () => Record<string, string>;

  setTouched: (name: string, value: boolean) => void;
  setValidating: (name: string, value: boolean) => void;
  setSubmitting: (value: boolean) => void;

  // Field registration
  registerField: (field: FieldRegistration) => void;
  unregisterField: (name: string) => void;
  setFocusedField: (name: string | null) => void;

  // Form lifecycle
  reset: (values?: Record<string, unknown>) => void;
}

// ─── Form Controller (useFieldFlow return type) ──────────────────────────────

export interface FormController {
  // Values
  getValues: () => Record<string, unknown>;
  getValue: (name: string) => unknown;
  setValue: (name: string, value: unknown) => void;

  // Errors
  getErrors: () => Record<string, string>;
  getError: (name: string) => string | null;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;

  // Focus
  focus: (name: string) => void;
  blur: () => void;

  // Form
  submit: () => void;
  reset: (values?: Record<string, unknown>) => void;
  isDirty: () => boolean;
  isValid: () => boolean;
  isSubmitting: () => boolean;

  // Watch
  watch: (name: string) => unknown;
  watchAll: () => Record<string, unknown>;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export interface PersistStorage {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

// ─── FieldForm Props ─────────────────────────────────────────────────────────

export interface FieldFormProps<T extends Record<string, unknown> = Record<string, unknown>> {
  children: ReactNode;
  onFinish: (values: T) => void | Promise<void>;
  defaultValues?: Partial<T>;

  // Theme overrides
  theme?: Partial<FormTheme>;

  // Keyboard avoidance
  avoidKeyboard?: boolean;
  extraScrollPadding?: number;
  dismissMode?: 'none' | 'interactive' | 'on-drag';

  // Scrolling
  scrollable?: boolean;
  inverted?: boolean;
  scrollViewProps?: ScrollViewProps;
  ScrollViewComponent?: any;

  // Validation
  validateOn?: 'submit' | 'blur' | 'change';
  revalidateOn?: 'blur' | 'change';

  // Persistence
  persistKey?: string;
  persistStorage?: PersistStorage;

  // Keyboard callbacks
  onKeyboardShow?: (height: number) => void;
  onKeyboardHide?: () => void;

  // Haptics
  haptics?: HapticConfig;
  errorShake?: boolean;

  // Accessory views
  accessoryView?: ReactElement;
  fieldAccessoryView?: Record<string, ReactElement>;
  accessoryViewID?: string;

  // Analytics
  onAnalytics?: (data: FormAnalytics) => void;

  // Misc
  autoScroll?: boolean;
  chainEnabled?: boolean;
  autoReturnKeyType?: boolean;
  dismissKeyboardOnTap?: boolean;
  dismissKeyboardOnSubmit?: boolean;

  // Style
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

// ─── Base Field Props ────────────────────────────────────────────────────────

export interface BaseFieldProps {
  name: string;
  label?: string;
  rules?: ValidationRules;
  shouldIgnoreChain?: boolean;
  showIf?: (values: Record<string, unknown>) => boolean;

  // Icons
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconStyle?: ViewStyle;
  rightIconStyle?: ViewStyle;

  // Global Styles
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;

  // Haptics
  hapticOnFocus?: boolean;
  hapticOnError?: boolean;
}

// ─── FieldInput Props ────────────────────────────────────────────────────────

export interface FieldInputProps extends Omit<TextInputProps, 'ref'>, BaseFieldProps {
  // Chain
  nextRef?: RefObject<any>;
  onFormSubmit?: () => void;

  // Accessory
  accessoryView?: ReactElement;
  keyboardExtension?: ReactElement;
  suppressKeyboard?: boolean;

  // External adapters
  control?: unknown; // React Hook Form control
  formik?: unknown;  // Formik bag
}

// ─── FieldOTP Props ──────────────────────────────────────────────────────────

export interface FieldOTPProps extends BaseFieldProps {
  length?: number;
  autoFocus?: boolean;
  autoSubmit?: boolean;
  onComplete?: (code: string) => void;
  secureTextEntry?: boolean;
  variant?: 'border' | 'underlined' | 'solid';
  cellStyle?: ViewStyle;
  textStyle?: TextStyle;
  focusedCellStyle?: ViewStyle;
  errorCellStyle?: ViewStyle;
  accessoryView?: ReactNode;
}

// ─── FieldPhone Props ────────────────────────────────────────────────────────

export interface FieldPhoneProps extends Omit<TextInputProps, 'ref'>, BaseFieldProps {
  defaultCountry?: string;
  showFlag?: boolean;
  showDialCode?: boolean;
}

// ─── FieldPassword Props ─────────────────────────────────────────────────────

export interface FieldPasswordProps extends FieldInputProps {
  showStrengthMeter?: boolean;
  strengthLabels?: [string, string, string, string];
  strengthColors?: [string, string, string, string];
}

// ─── FieldAmount Props ───────────────────────────────────────────────────────

export interface FieldAmountProps extends Omit<TextInputProps, 'ref'>, BaseFieldProps {
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

// ─── FieldSelect Props ───────────────────────────────────────────────────────

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  icon?: ReactNode;
}

export interface FieldSelectProps<T = string> extends BaseFieldProps {
  options: SelectOption<T>[];
  placeholder?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  sheetTitle?: string;
  renderOption?: (option: SelectOption<T>, selected: boolean) => ReactNode;
}

// ─── FieldDate Props ─────────────────────────────────────────────────────────

export interface FieldDateProps extends BaseFieldProps {
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'compact' | 'inline' | 'spinner';
  minimumDate?: Date;
  maximumDate?: Date;
  format?: string;
  placeholder?: string;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIconStyle?: ViewStyle;
  rightIconStyle?: ViewStyle;
  showIf?: (values: Record<string, unknown>) => boolean;
}

// ─── FieldTags Props ─────────────────────────────────────────────────────────

export interface FieldTagsProps extends BaseFieldProps {
  placeholder?: string;
  separators?: string[];
  maxTags?: number;
  suggestions?: string[];
  renderTag?: (tag: string, onRemove: () => void) => ReactElement;
  tagStyle?: ViewStyle;
}

// ─── FieldSearch Props ───────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: ReactElement;
}

export interface FieldSearchProps extends BaseFieldProps {
  onSearch: (query: string) => Promise<SearchResult[]> | SearchResult[];
  debounce?: number;
  minChars?: number;
  renderResult?: (item: SearchResult) => ReactElement;
  placeholder?: string;
  loading?: boolean;
  autoFocus?: boolean;
}

// ─── Accessory View Types ────────────────────────────────────────────────────

export interface FieldInfo {
  name: string;
  label?: string;
  value: unknown;
  error: string | null;
  type: FieldType;
}

export interface AccessoryPrevNextProps {
  showPrev?: boolean;
  showNext?: boolean;
  showDone?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  doneLabel?: string;
  onDone?: () => void;
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

export interface AccessoryDoneProps {
  label?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export interface AccessoryToolbarProps {
  renderLeft?: (field: FieldInfo) => ReactElement;
  renderCenter?: (field: FieldInfo) => ReactElement;
  renderRight?: (field: FieldInfo) => ReactElement;
  height?: number;
  containerStyle?: ViewStyle;
  borderTopWidth?: number;
  borderTopColor?: string;
}

export interface AccessoryFieldLabelProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface AccessoryCharCountProps {
  warningThreshold?: number;
  dangerThreshold?: number;
  warningColor?: string;
  dangerColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface AccessoryPasswordStrengthProps {
  showLabel?: boolean;
  barStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

export interface AccessoryMarkdownProps {
  actions?: Array<'bold' | 'italic' | 'underline' | 'link' | 'bullet' | 'quote'>;
  buttonStyle?: ViewStyle;
  activeButtonStyle?: ViewStyle;
}

export interface AccessorySuggestionsProps {
  suggestions?: string[];
  onFetch?: (query: string) => Promise<string[]>;
  chipStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

// ─── Keyboard Frame ──────────────────────────────────────────────────────────

export interface KeyboardFrame {
  height: number;
  startY: number;
  endY: number;
  duration: number;
  easing: string;
  isVisible: boolean;
  isAnimating: boolean;
}

export interface FocusedFieldInfo {
  name: string | null;
  ref: RefObject<any>;
  absoluteY: number;
  height: number;
  distanceFromKeyboard: number;
  value: unknown;
  label?: string;
}

// ─── Keyboard Hooks ──────────────────────────────────────────────────────────

export interface UseKeyboardHeightOptions {
  showEvent?: 'keyboardWillShow' | 'keyboardDidShow';
  hideEvent?: 'keyboardWillHide' | 'keyboardDidHide';
}

export interface KeyboardHeightPayload {
  height: number;
  event: unknown;
}

// ─── Form Analytics ──────────────────────────────────────────────────────────

export interface FormAnalytics {
  timeToFirstInteraction: number;
  timeToSubmit: number;
  fieldDurations: Record<string, number>;
  fieldErrors: Record<string, number>;
  abandonedFields: string[];
  submitAttempts: number;
  lastSubmitAt: Date | null;
}

// ─── Platform Parity ─────────────────────────────────────────────────────────

export interface OverFieldViewProps {
  visible: boolean;
  height?: number;
  animationDuration?: number;
  onShow?: () => void;
  onHide?: () => void;
  style?: ViewStyle;
  children: ReactNode;
}

export interface KeyboardStickyViewProps {
  offset?: { closed?: number; opened?: number };
  style?: ViewStyle;
  children: ReactNode;
}

export interface KeyboardFillViewProps {
  height?: number;
  animationDuration?: number;
  style?: ViewStyle;
  children: ReactNode;
}

export interface KeyboardBackgroundSyncProps {
  color?: string | { light: string; dark: string };
}

export enum SoftInputMode {
  ADJUST_RESIZE = 'adjustResize',
  ADJUST_PAN = 'adjustPan',
  ADJUST_NOTHING = 'adjustNothing',
}

// ─── FormProvider ────────────────────────────────────────────────────────────

export interface FormProviderProps {
  theme?: FormTheme;
  preload?: boolean;
  preloadDelay?: number;
  children: ReactNode;
}

// ─── Form Toolbar ────────────────────────────────────────────────────────────

export interface FormToolbarProps {
  renderPrev?: (onPress: () => void) => ReactElement;
  renderNext?: (onPress: () => void) => ReactElement;
  renderDone?: (onPress: () => void) => ReactElement;
  renderCenter?: (label: string) => ReactElement;
  renderActions?: () => ReactElement;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

// ─── Imperative Handles ──────────────────────────────────────────────────────

export interface FieldFormHandle {
  focusNext: (currentIndex: number) => void;
  scrollInputIntoView: (input: any, padding?: number) => void;
  dismissKeyboard: () => void;
  getScrollView: () => any;
  submit: () => void;
  reset: (values?: Record<string, unknown>) => void;
}

// ─── Submit Editing Event ────────────────────────────────────────────────────

export type FieldInputSubmitEditingEvent =
  NativeSyntheticEvent<TextInputSubmitEditingEventData>;

// ─── Adapter Types ───────────────────────────────────────────────────────────

export interface SchemaFormConfig<T> {
  onSubmit: (values: T) => void | Promise<void>;
  fieldConfig?: Partial<Record<keyof T, Partial<FieldInputProps>>>;
  theme?: FormTheme;
  persistKey?: string;
}

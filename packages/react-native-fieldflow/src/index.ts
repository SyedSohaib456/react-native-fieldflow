/**
 * react-native-fieldflow — Complete Public API
 *
 * The ultimate keyboard management and form flow solution for React Native.
 * Zero native modules. Expo compatible. Full TypeScript.
 *
 * @packageDocumentation
 */

// ─── Core Components ─────────────────────────────────────────────────────────

export { FieldForm } from './core/FieldForm';
export { FormProvider } from './core/FormProvider';

// ─── Field Components ────────────────────────────────────────────────────────

export { FieldInput } from './fields/FieldInput';
export { FieldOTP } from './fields/FieldOTP';
export { FieldPhone } from './fields/FieldPhone';
export { FieldPassword } from './fields/FieldPassword';
export { FieldAmount } from './fields/FieldAmount';
export { FieldSelect } from './fields/FieldSelect';
export { FieldDate } from './fields/FieldDate';
export { FieldTags } from './fields/FieldTags';
export { FieldSearch } from './fields/FieldSearch';

// ─── Accessory Views ─────────────────────────────────────────────────────────

export { FormToolbar } from './accessory/FormToolbar';
export {
  AccessoryPrevNext,
  AccessoryDone,
  AccessoryToolbar,
  AccessoryFieldLabel,
  AccessoryCharCount,
  AccessoryPasswordStrength,
  AccessorySuggestions,
} from './accessory/AccessoryPresets';

// ─── Platform Parity Components ──────────────────────────────────────────────

export {
  KeyboardStickyView,
  OverFieldView,
  KeyboardFillView,
  KeyboardBackgroundSync,
  setSoftInputMode,
  useSoftInputMode,
  SoftInputMode,
} from './platform/PlatformComponents';

// ─── DevTools ────────────────────────────────────────────────────────────────

export { FormDevTools } from './devtools/FormDevTools';

// ─── Hooks ───────────────────────────────────────────────────────────────────

// Form state hooks
export {
  useFieldFlow,
  useFieldError,
  useFieldState,
  useWatch,
  useWatchAll,
  useFocusedField,
} from './core/FormContext';

// Keyboard hooks
export {
  useKeyboardHeight,
  useKeyboardVisible,
  useKeyboardState,
  useKeyboardWillShow,
  useKeyboardWillHide,
  useKeyboardFrame,
  dismissKeyboard,
  subscribeKeyboard,
  isReanimatedAvailable,
} from './keyboard/hooks';

// Analytics hook
export { useFormAnalytics } from './analytics/FormAnalytics';

// ─── Utilities ───────────────────────────────────────────────────────────────

export { createForm } from './adapters/schema';
export { clearPersistedForm } from './persistence/PersistEngine';
export { preloadKeyboard } from './keyboard/preload';
export { triggerHaptic, isHapticAvailable } from './haptics/HapticEngine';

// ─── Validation ──────────────────────────────────────────────────────────────

export {
  validateField,
  validateFieldSync,
  validateAllFields,
} from './validation/ValidationEngine';

// ─── Theme ───────────────────────────────────────────────────────────────────

export { useTheme } from './theme/ThemeContext';
export { defaultTheme, mergeTheme } from './theme/defaultTheme';

// ─── Types ───────────────────────────────────────────────────────────────────

export type {
  // Form
  FieldFormProps,
  FieldFormHandle,
  FormController,
  FormProviderProps,
  FormTheme,
  FormThemeColors,
  FormThemeSpacing,
  ResolvedFormTheme,
  FormAnalytics,

  // Fields
  FieldInputProps,
  FieldOTPProps,
  FieldPhoneProps,
  FieldPasswordProps,
  FieldAmountProps,
  FieldSelectProps,
  FieldDateProps,
  FieldTagsProps,
  FieldSearchProps,
  SelectOption,
  SearchResult,

  // Field State
  FieldState,
  FieldRegistration,
  FieldType,
  FieldInfo,
  FocusedFieldInfo,

  // Validation
  ValidationRules,
  ValidationResult,

  // Haptics
  HapticStyle,
  HapticConfig,

  // Persistence
  PersistStorage,

  // Keyboard
  KeyboardFrame,
  KeyboardHeightPayload,
  UseKeyboardHeightOptions,

  // Accessory
  AccessoryPrevNextProps,
  AccessoryDoneProps,
  AccessoryToolbarProps,
  AccessoryFieldLabelProps,
  AccessoryCharCountProps,
  AccessoryPasswordStrengthProps,
  AccessorySuggestionsProps,
  FormToolbarProps,

  // Platform
  OverFieldViewProps,
  KeyboardStickyViewProps,
  KeyboardFillViewProps,
  KeyboardBackgroundSyncProps,

  // Adapters
  SchemaFormConfig,
} from './types';

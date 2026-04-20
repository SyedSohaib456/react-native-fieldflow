/**
 * @packageDocumentation
 * Flexible keyboard-aware form primitives: scroll + avoid + field chain + hooks.
 * Import from `~/src/utils/keyboard` (this folder’s public API).
 * Human docs: `./README.md` · Examples: `./examples/basics.example.tsx`.
 */

export type {
  FieldFormContextValue,
  FieldFormHandle,
  FieldFormProps,
  KeyboardHeightPayload,
  FieldInputProps,
  FieldInputSubmitEditingEvent,
  KeyboardPlatformOs,
  KeyboardVerticalOffsetResolver,
  UseKeyboardHeightOptions,
  Focusable,
} from './types';

export { FieldFlowContext, useFieldFlow } from './context';
export { FieldForm } from './FieldForm';
export { FieldInput } from './FieldInput';
export {
  dismissKeyboard,
  subscribeKeyboard,
  useKeyboardHeight,
  useKeyboardState,
  useKeyboardVisible,
  useFieldFlowController,
} from './hooks';

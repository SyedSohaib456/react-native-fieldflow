import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import { Keyboard, TextInput } from 'react-native';

import { useFieldFlow } from './context';
import type { FieldInputProps } from './types';

export const FieldInput = forwardRef<TextInput, FieldInputProps>((props, forwardedRef) => {
  const {
    chainIndex,
    onFormSubmit,
    nextRef,
    onSubmitEditing,
    returnKeyType,
    registerWithForm = true,
    blurOnSubmit: blurOnSubmitProp,
    skip,
    // When true, this field is inside the keyboard accessory view (outside
    // the ScrollView). We must skip scrollInputIntoView for these fields
    // because the scroll responder cannot measure nodes outside its tree —
    // which causes the "Error measuring text field" warning spam.
    isAccessoryField = false,
    ...rest
  } = props;

  const internalRef = useRef<TextInput | null>(null);

  const ctx = useFieldFlow();
  const indexRef = useRef<number>(-1);

  useEffect(() => {
    if (!registerWithForm || !ctx) {
      return undefined;
    }
    indexRef.current = ctx.register(internalRef, skip);
    return () => ctx.unregister(internalRef);
  }, [ctx, registerWithForm, skip]);

  useEffect(() => {
    if (registerWithForm && ctx) {
      ctx.updateField(internalRef, skip);
    }
  }, [skip, ctx, registerWithForm]);

  const isLast = useCallback((): boolean => {
    if (!ctx) return true;
    const idx = chainIndex ?? indexRef.current;
    if (idx === -1) return true;
    return !ctx.hasNext(idx);
  }, [ctx, chainIndex]);

  const handleSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitEditing?.(e);
      if (!ctx) return;

      const idx = chainIndex ?? indexRef.current;

      if (nextRef?.current) {
        nextRef.current.focus();
      } else if (isLast()) {
        if (ctx.submitOnLastFieldDone) {
          onFormSubmit?.();
          ctx.submitForm();
        } else {
          Keyboard.dismiss();
        }
      } else if (ctx.chainEnabled) {
        ctx.focusNext(idx);
      }
    },
    [ctx, chainIndex, nextRef, isLast, onSubmitEditing, onFormSubmit],
  );

  const resolvedReturnKeyType =
    returnKeyType ?? (ctx?.autoReturnKeyType ? (isLast() ? 'done' : 'next') : undefined);
  const blurOnSubmit = blurOnSubmitProp ?? false;

  const handleFocus = useCallback(
    (e: any) => {
      rest.onFocus?.(e);
      // Skip scrollInputIntoView for accessory fields — they live outside the
      // ScrollView's node tree so the scroll responder cannot measure them,
      // producing "Error measuring text field" warnings.
      if (ctx && internalRef.current && ctx.autoScroll && !isAccessoryField) {
        ctx.scrollInputIntoView(internalRef.current);
      }
    },
    [ctx, isAccessoryField, rest.onFocus],
  );

  return (
    <TextInput
      {...rest}
      ref={internalRef}
      onFocus={handleFocus}
      blurOnSubmit={blurOnSubmit}
      returnKeyType={resolvedReturnKeyType}
      onSubmitEditing={handleSubmitEditing}
    />
  );
});

FieldInput.displayName = 'FieldInput';
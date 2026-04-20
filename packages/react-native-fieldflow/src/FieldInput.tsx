import React, { forwardRef, useCallback, useEffect, useReducer, useRef } from 'react';
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

  const setRef = useCallback(
    (node: TextInput | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<TextInput | null>).current = node;
      }
    },
    [forwardedRef],
  );

  const ctx = useFieldFlow();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const idRef = useRef<number>(-1);

  useEffect(() => {
    if (ctx) {
      return ctx.subscribeRegistry(forceUpdate);
    }
    return undefined;
  }, [ctx]);

  useEffect(() => {
    if (!registerWithForm || !ctx) {
      return undefined;
    }
    // Intentionally mount-only — skip and isAccessoryField changes are handled
    // by the updateField effect below. Re-registering on prop change would shift
    // the field's position in the chain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    idRef.current = ctx.register(internalRef, skip, isAccessoryField);
    return () => ctx.unregister(internalRef);
  }, [ctx, registerWithForm]); // Mount-only registration

  useEffect(() => {
    if (registerWithForm && ctx && idRef.current !== -1) {
      ctx.updateField(internalRef, skip, isAccessoryField);
    }
  }, [skip, ctx, registerWithForm, isAccessoryField]);

  const isLast = useCallback((): boolean => {
    if (!ctx || idRef.current === -1) return true;
    return !ctx.hasNext(idRef.current);
  }, [ctx]);

  const handleSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitEditing?.(e);
      if (!ctx || props.multiline || idRef.current === -1) return;

      const id = idRef.current;

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
        ctx.focusNext(id);
      }
    },
    [ctx, nextRef, isLast, onSubmitEditing, onFormSubmit, props.multiline],
  );

  const resolvedReturnKeyType =
    returnKeyType ??
    (ctx?.autoReturnKeyType && !props.multiline
      ? isLast()
        ? 'done'
        : 'next'
      : undefined);
  const blurOnSubmit = blurOnSubmitProp ?? false;

  const handleFocus = useCallback(
    (e: any) => {
      rest.onFocus?.(e);
      // Skip scrollInputIntoView for accessory fields — they live outside the
      // ScrollView's node tree so the scroll responder cannot measure them,
      // producing "Error measuring text field" warnings.
      if (
        ctx &&
        internalRef.current &&
        ctx.autoScroll &&
        !isAccessoryField &&
        ctx.isKeyboardOpen()
      ) {
        ctx.scrollInputIntoView(internalRef.current);
      }
    },
    [ctx, isAccessoryField, rest.onFocus],
  );

  return (
    <TextInput
      {...rest}
      ref={setRef}
      onFocus={handleFocus}
      blurOnSubmit={blurOnSubmit}
      returnKeyType={resolvedReturnKeyType}
      onSubmitEditing={handleSubmitEditing}
    />
  );
});

FieldInput.displayName = 'FieldInput';
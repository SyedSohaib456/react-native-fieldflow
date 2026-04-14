import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
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
      if (ctx && internalRef.current && ctx.autoScroll) {
        ctx.scrollInputIntoView(internalRef.current);
      }
    },
    [ctx, rest.onFocus],
  );

  return (
    <TextInput
      // eslint-disable-next-line react/jsx-props-no-spreading -- TextInput passthrough
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

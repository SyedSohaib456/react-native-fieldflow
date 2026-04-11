/**
 * Reference examples for `~/src/utils/keyboard`.
 * Not mounted by the router — copy patterns into real screens.
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import {
  dismissKeyboard,
  FieldForm,
  type FieldFormHandle,
  FieldInput,
  subscribeKeyboard,
  useKeyboardState,
} from '../index';

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  pad: { padding: 16, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

/** 1) Minimal chained inputs — “Next” / “Done” + submit on last field. */
export function ExampleMinimalKeyboardForm() {
  const onSubmit = useCallback(() => {
    // validate + API
  }, []);

  return (
    <FieldForm onSubmit={onSubmit} extraScrollPadding={48}>
      <View style={styles.pad}>
        <FieldInput placeholder="First name" style={styles.input} />
        <FieldInput placeholder="Last name" style={styles.input} />
        <FieldInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </FieldForm>
  );
}

/** 2) Imperative ref — dismiss keyboard or scroll a raw TextInput into view. */
export function ExampleKeyboardFormRef() {
  const formRef = useRef<FieldFormHandle>(null);
  const orphanRef = useRef<TextInput>(null);

  return (
    <FieldForm ref={formRef} scrollable avoidKeyboard>
      <View style={styles.pad}>
        <FieldInput placeholder="Field A" style={styles.input} />
        <TextInput ref={orphanRef} placeholder="Plain input" style={styles.input} />
        <Button
          title="Scroll orphan into view"
          onPress={() => formRef.current?.scrollInputIntoView(orphanRef.current)}
        />
        <Button title="Dismiss keyboard" onPress={() => formRef.current?.dismissKeyboard()} />
      </View>
    </FieldForm>
  );
}

/** 3) Hide a footer when the keyboard is open (single hook, no form listeners). */
export function ExampleKeyboardStateFooter() {
  const { visible } = useKeyboardState();

  return (
    <View style={styles.flex1}>
      <FieldForm scrollable={false}>
        <View style={styles.pad}>
          <FieldInput placeholder="Message" style={styles.input} />
        </View>
      </FieldForm>
      {!visible ? <Button title="Continue" onPress={() => {}} /> : null}
    </View>
  );
}

/** 4) Imperative subscription (e.g. legacy module outside React). */
export function ExampleSubscribeKeyboardOnce() {
  useEffect(() => {
    const unsub = subscribeKeyboard(
      ({ height }) => {
        console.log('[subscribeKeyboard] show', height);
      },
      () => {
        console.log('[subscribeKeyboard] hide');
      },
    );
    return unsub;
  }, []);

  return null;
}

/** 5) Global dismiss helper (anywhere). */
export function ExampleDismissFromButton() {
  return <Button title="Dismiss keyboard" onPress={dismissKeyboard} />;
}

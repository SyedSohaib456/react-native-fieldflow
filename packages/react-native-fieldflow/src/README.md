<div align="center">

# FieldFlow

### High-performance form primitives for React Native — fields that flow via auto-scroll, avoidance, and focus chaining. No native dependencies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React Native](https://img.shields.io/badge/React%20Native-compatible-61dafb?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-compatible-000?style=flat-square&logo=expo)](https://expo.dev)

<br/>

**Internal module** — lives in `src/utils/keyboard`. Import as `~/src/utils/keyboard`.

<br/>

| **`FieldForm`** | **`FieldInput`** | **Hooks** |
|---|---|---|
| ScrollView + Animated Spacer + context | Chained Next/Done + auto-flow | Height, visibility, `subscribeKeyboard` |
| Zero-flicker animated avoidance | Works with `forwardRef` fields | Android back → dismiss keyboard (form) |

</div>

---

## The problem

```
🤦 Keyboard covers the primary CTA and the user can’t scroll the focused field into view.
🤦 You re-implement the same KeyboardAvoidingView + ScrollView stack on every screen.
🤦 “Next” on the software keyboard doesn’t move focus; “Done” doesn’t submit.
🤦 You need keyboard height to hide a sticky footer — another copy-pasted `Keyboard.addListener` block.
```

**FieldFlow** centralizes that behavior behind a small API you can tune per screen or extract to a real npm package later.

---

## How it works (30 seconds)

1. **Wrap** your screen body in `<FieldForm>` (optional `onSubmit`, `scrollViewProps`, etc.).
2. **Use** `<FieldInput>` for plain `TextInput` chains, **or** keep your own `TextField` and wire `ref` + `onSubmitEditing` yourself — the form still gives you scroll + avoid + listeners.
3. **Read** keyboard height with `useKeyboardHeight` / `useKeyboardState` when you need layout outside the form (e.g. hide a bottom bar).
4. **Optionally** call imperative methods via `ref` on `FieldForm`: `focusNext`, `scrollInputIntoView`, `dismissKeyboard`, `getScrollView`.

No native modules. Works with Expo and bare React Native.

---

## Installation (monorepo / copy-paste)

This is **not** published to npm in this repository. It is a first-class module inside the app:

```ts
import {
  FieldForm,
  FieldInput,
  FieldFlowContext,
  useFieldFlow,
  useKeyboardHeight,
  useKeyboardVisible,
  useKeyboardState,
  dismissKeyboard,
  subscribeKeyboard,
} from 'react-native-fieldflow';
```

> Path alias `~/src/*` must match your `tsconfig` / Metro resolver (already configured in this project).

---

# `FieldForm` ⭐

> Scroll + keyboard avoidance + optional keyboard show/hide callbacks + Android hardware back dismisses the keyboard (without consuming the back press).

## Before vs after

```diff
- <KeyboardAwareScrollView ...>
-   <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
-     {children}
-   </KeyboardAvoidingView>
- </KeyboardAwareScrollView>

+ <FieldForm
+   onSubmit={() => submit()}
+   onKeyboardShow={({ height }) => setFooterVisible(height === 0)}
+   scrollViewProps={{ keyboardDismissMode: 'none' }}
+ >
+   {children}
+ </FieldForm>
```

## Basic setup

```tsx
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { KeyboardForm, KeyboardFormHandle, KeyboardInput } from '~/src/utils/keyboard';

export function LoginExample() {
  const formRef = useRef<KeyboardFormHandle>(null);

  const onSubmit = useCallback(() => {
    console.log('submit from last field or custom button');
  }, []);

  return (
    <KeyboardForm ref={formRef} onSubmit={onSubmit} extraScrollPadding={48}>
      <View style={{ padding: 16, gap: 12 }}>
        <KeyboardInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
        <KeyboardInput placeholder="Password" secureTextEntry />
      </View>
    </KeyboardForm>
  );
}
```

## With `KeyboardAwareScrollView` (custom scroll)

Your custom component **must** forward `ref` to something that supports `scrollResponderScrollNativeHandleToKeyboard` (same contract as RN `ScrollView`).

```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardForm } from '~/src/utils/keyboard';

<KeyboardForm
  ScrollViewComponent={KeyboardAwareScrollView}
  scrollViewProps={{
    enableOnAndroid: true,
    extraScrollHeight: 80,
    keyboardShouldPersistTaps: 'handled',
  }}
>
  {children}
</KeyboardForm>
```

## Keyboard visibility without duplicating listeners

`KeyboardForm` only attaches listeners when `onKeyboardShow` / `onKeyboardHide` are passed (or you force `enableKeyboardListeners`). For arbitrary UI, use hooks:

```tsx
import { useKeyboardState } from '~/src/utils/keyboard';

const { height, visible } = useKeyboardState();

return !visible ? <StickyContinue /> : null;
```

---

## API — `KeyboardForm`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Screen / form content |
| `onSubmit` | `() => void` | — | Fired when `submitForm()` runs from context (e.g. last `KeyboardInput` Done) |
| `scrollable` | `boolean` | `true` | Wrap children in a vertical scroll surface |
| `avoidKeyboard` | `boolean` | `true` | Wrap in `KeyboardAvoidingView` |
| `ScrollViewComponent` | `ComponentType<ScrollViewProps>` | `ScrollView` | Custom scroll (must forward ref) |
| `KeyboardAvoidingViewComponent` | `ComponentType<KeyboardAvoidingViewProps>` | RN KAV | Custom avoiding wrapper |
| `scrollViewProps` | `ScrollViewProps` | — | Passed to scroll surface; `contentContainerStyle` merged with defaults |
| `keyboardAvoidingViewProps` | `KeyboardAvoidingViewProps` | — | Passed to KAV; `style` merged with `{ flex: 1 }` |
| `extraScrollPadding` | `number` | `40` | Extra bottom padding inside `contentContainerStyle` |
| `contentContainerStyle` | `StyleProp` | — | Merged after defaults |
| `applyDefaultScrollContentFlexGrow` | `boolean` | `true` | Adds `{ flexGrow: 1 }` to content container |
| `keyboardShouldPersistTaps` | `ScrollView` prop | `'handled'` | |
| `keyboardDismissMode` | `ScrollView` prop | `'interactive'` | |
| `showsVerticalScrollIndicator` | `boolean` | `false` | |
| `iosKeyboardAvoidingBehavior` | KAV `behavior` | `'padding'` | |
| `androidKeyboardAvoidingBehavior` | KAV `behavior` | `'height'` | |
| `keyboardVerticalOffset` | `number \| (platform) => number` | iOS `0`, Android `20` | |
| `keyboardShowEvent` / `keyboardHideEvent` | string union | platform defaults | Override listener events |
| `enableKeyboardListeners` | `boolean` | auto | `true` if any show/hide callback is set |
| `onKeyboardShow` | `(payload: { height; event }) => void` | — | |
| `onKeyboardHide` | `() => void` | — | |
| `androidDismissKeyboardOnBackPress` | `boolean` | `true` | Android hardware back dismisses keyboard |
| `dismissKeyboardOnSubmit` | `boolean` | `true` | `Keyboard.dismiss` before `onSubmit` |
| `dismissKeyboardOnFocusPastLast` | `boolean` | `true` | When there is no “next” field |
| `scrollViewRef` | `Ref<ScrollView \| null>` | — | Optional external ref merged with internal |

## Ref — `KeyboardFormHandle`

| Method | Description |
|--------|-------------|
| `focusNext(index)` | Focus registered field `index + 1` and scroll into view |
| `scrollInputIntoView(input, padding?)` | Scroll so `TextInput` sits above keyboard |
| `dismissKeyboard()` | `Keyboard.dismiss()` |
| `getScrollView()` | Current `ScrollView` (or custom scroll ref target) |

---

## API — `KeyboardInput`

Drop-in replacement-style wrapper around RN `TextInput` that registers with the parent `KeyboardForm`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| *…all `TextInputProps`* | | | Forwarded after internal handlers |
| `chainIndex` | `number` | auto | Registration order override |
| `onFormSubmit` | `() => void` | — | Runs before `ctx.submitForm()` on last field |
| `nextRef` | `RefObject<TextInput>` | — | Focus this instead of “next” in chain |
| `registerWithForm` | `boolean` | `true` | Set `false` to render outside a form (no-op context) |

Return key: last field → `done`, otherwise `next` (unless you pass `returnKeyType`).  
`blurOnSubmit` defaults to `false`; set explicitly on the last field if you want dismiss-on-submit behavior.

---

## Context — `useKeyboardForm` / `KeyboardFormContext`

Advanced integrations (e.g. custom `TextInput` wrappers):

```tsx
import { useKeyboardForm } from '~/src/utils/keyboard';

const ctx = useKeyboardForm();
ctx?.focusNext(0);
ctx?.submitForm();
```

`KeyboardFormContext` is exported if you need a custom provider boundary (rare).

---

# Hooks

## `useKeyboardHeight(options?)`

Returns keyboard height in px; `0` when hidden. Uses `keyboardWillShow` / `keyboardWillHide` on iOS and `keyboardDidShow` / `keyboardDidHide` on Android by default.

| Option | Type | Description |
|--------|------|-------------|
| `showEvent` | `'keyboardWillShow' \| 'keyboardDidShow'` | Override |
| `hideEvent` | `'keyboardWillHide' \| 'keyboardDidHide'` | Override |

## `useKeyboardVisible(options?)`

`useKeyboardHeight() > 0`.

## `useKeyboardState(options?)`

`{ height, visible }` — single subscription internally.

## `dismissKeyboard()`

`Keyboard.dismiss()`.

## `subscribeKeyboard(onShow, onHide, options?)`

Imperative subscription; returns `unsubscribe` function. Useful outside React (e.g. stores, class components).

---

## File layout (package shape)

```
src/utils/keyboard/
├── README.md           ← you are here
├── index.ts            # public exports
├── types.ts
├── context.tsx
├── KeyboardForm.tsx
├── KeyboardInput.tsx
├── hooks.ts
└── examples/
    └── basics.example.tsx
```

---

## FAQ

<details>
<summary><strong>Can I use my design-system <code>TextField</code> instead of <code>KeyboardInput</code>?</strong></summary>

Yes. Keep `KeyboardForm` for scroll + avoid + listeners. Forward a `ref` to the underlying `TextInput` and implement `onSubmitEditing` / `returnKeyType` to move focus or call `handleSubmit`. See `examples/basics.example.tsx`.
</details>

<details>
<summary><strong>Why is my custom <code>ScrollViewComponent</code> not scrolling to the focused field?</strong></summary>

The ref must attach to a scroll view that implements `scrollResponderScrollNativeHandleToKeyboard` (same as RN `ScrollView`). If your library does not forward `ref` correctly, use `scrollViewRef` + the library’s own scroll APIs, or fall back to `KeyboardForm`’s imperative `scrollInputIntoView` with a ref that points at a real `ScrollView`.
</details>

<details>
<summary><strong>Do I pay double listener cost if I use both <code>KeyboardForm</code> callbacks and <code>useKeyboardHeight</code>?</strong></summary>

Yes — those are separate subscriptions. Prefer `onKeyboardShow` / `onKeyboardHide` on the form when the whole subtree needs the same behavior, or use only hooks in screens that don’t use `KeyboardForm`.
</details>

<details>
<summary><strong>Expo Router / React Navigation?</strong></summary>

No coupling to navigation. Mount `KeyboardForm` per screen (or in a layout) like any other wrapper.
</details>

---

## Examples

See **[`examples/basics.example.tsx`](./examples/basics.example.tsx)** for copy-paste patterns: minimal form, imperative ref, custom `TextField`-style wiring, and `subscribeKeyboard`.

---

## License

Same as the parent repository (this module ships with the app, not as a standalone npm package).

---

Inspired by common keyboard UX patterns in production React Native apps; structured like a publishable internal package for clarity and reuse.

<div align="center">

<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/logo.png" alt="react-native-fieldflow" width="360" />

<br/>
<br/>

**The high-performance keyboard avoidance and focus management library React Native should have shipped with.**

<br/>

[![npm](https://img.shields.io/npm/v/react-native-fieldflow?color=6366f1&style=flat-square)](https://www.npmjs.com/package/react-native-fieldflow)
[![RN](https://img.shields.io/badge/React%20Native-%3E%3D0.68-61dafb?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-compatible-000020?style=flat-square&logo=expo)](https://expo.dev)

<br/>

**react-native-fieldflow** provides a professional-grade, zero-config solution for the three biggest pain points in React Native forms: **Keyboard Avoidance**, **Focus Management (Chaining)**, and **Synced Accessory Views**.

<br/>

> **Zero refs &nbsp;·&nbsp; Zero platform switches &nbsp;·&nbsp; Zero boilerplate**

<br/>

### 🚀 Core MVP Features:
- **Automatic Next-Field Focusing**: Effortless input chaining without manual refs.
- **"Ref to Next" Automation**: Zero-config focus transition from field to field.
- **Synced Accessory Views**: Cross-platform toolbars that move in perfect harmony with the keyboard.
- **Native Keyboard Avoidance**: Smooth, 60fps layout adjustments using Reanimated worklets.
- **Expo Compatible**: Works out-of-the-box with Expo and bare workflows.

<br/>

<table>
<tr>
<td align="center" width="33%" style="padding:32px 20px">
<div style="font-size:48px">⌨️</div>
<br/>
<b>Smooth avoidance</b><br/>
<sub>Animated spacer — no layout jumps</sub>
</td>
<td align="center" width="33%" style="padding:32px 20px">
<div style="font-size:48px">⛓️</div>
<br/>
<b>Auto focus chain</b><br/>
<sub>Next → Done — zero refs</sub>
</td>
<td align="center" width="33%" style="padding:32px 20px">
<div style="font-size:48px">📱</div>
<br/>
<b>Platform parity</b><br/>
<sub>Identical on iOS and Android</sub>
</td>
</tr>
</table>

</div>

---

## Why this exists

Every React Native project with a form hits the same wall.

You need `KeyboardAvoidingView`. You need different `behavior` props per platform. You need `keyboardVerticalOffset` that works with your specific header height. You need `blurOnSubmit={false}` to stop the keyboard flashing between fields. You need a `ref` per input. You need to wire `onSubmitEditing` on every field to focus the next one. You need the last field to call submit. You need a `ScrollView` with `keyboardShouldPersistTaps="handled"`.

That's the minimum — on a simple login screen. Scale to 8 fields and this is 60 lines of boilerplate you write identically in every project.

**FieldFlow** replaces all of it with two components.

---

## Install

```sh
npm install react-native-fieldflow
```

> Zero native modules · No `pod install` · Expo compatible · React Native ≥ 0.68

---

## The entire API, right here

```tsx
import { FieldForm, FieldInput } from 'react-native-fieldflow';

export default function SignUpScreen() {
  return (
    <FieldForm onSubmit={handleSubmit}>
      <FieldInput placeholder="Full name"        textContentType="name" />
      <FieldInput placeholder="Email"            textContentType="emailAddress" keyboardType="email-address" autoCapitalize="none" />
      <FieldInput placeholder="Phone"            textContentType="telephoneNumber" keyboardType="phone-pad" />
      <FieldInput placeholder="Password"         textContentType="newPassword" secureTextEntry />
      <FieldInput placeholder="Confirm password" textContentType="newPassword" secureTextEntry />
    </FieldForm>
  );
}
```

That's a fully working, properly keyboard-avoiding, auto-chaining 5-field sign-up form.

- Field 1–4 get `returnKeyType="next"` automatically
- Field 5 gets `returnKeyType="done"` automatically
- Tapping Next on any field scrolls and focuses the next one
- Tapping Done on the last field calls `handleSubmit` and dismisses the keyboard
- The layout never jumps — an internal `Animated.Value` spacer tracks the keyboard frame natively
- Behavior is identical on iOS and Android

---

## Before and after

#### ❌ Without FieldFlow — 5 fields, 40+ lines

```tsx
// Every ref declared by hand
const nameRef    = useRef<TextInput>(null);
const emailRef   = useRef<TextInput>(null);
const phoneRef   = useRef<TextInput>(null);
const passRef    = useRef<TextInput>(null);
const confirmRef = useRef<TextInput>(null);

// Platform behavior differs — you have to know this
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  style={{ flex: 1 }}
>
  <ScrollView
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ flexGrow: 1 }}
  >
    {/* Every single field wired manually */}
    <TextInput ref={nameRef}    returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => emailRef.current?.focus()} />
    <TextInput ref={emailRef}   returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => phoneRef.current?.focus()} />
    <TextInput ref={phoneRef}   returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => passRef.current?.focus()} />
    <TextInput ref={passRef}    returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => confirmRef.current?.focus()} />
    <TextInput ref={confirmRef} returnKeyType="done" onSubmitEditing={handleSubmit} />
  </ScrollView>
</KeyboardAvoidingView>
```

#### ✅ With FieldFlow — same result, 8 lines

```tsx
import { FieldForm, FieldInput } from 'react-native-fieldflow';

<FieldForm onSubmit={handleSubmit}>
  <FieldInput placeholder="Full name" />
  <FieldInput placeholder="Email"    keyboardType="email-address" autoCapitalize="none" />
  <FieldInput placeholder="Phone"    keyboardType="phone-pad" />
  <FieldInput placeholder="Password" secureTextEntry />
  <FieldInput placeholder="Confirm"  secureTextEntry />
</FieldForm>
```

> `returnKeyType`, `blurOnSubmit`, `onSubmitEditing`, `KeyboardAvoidingView`, `ScrollView` — all handled. Nothing to configure.

---

## How it works

<div align="center">
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/architecture.png" width="580" alt="FieldFlow architecture diagram" />
</div>

<br/>

**FieldFlow** subscribes to native keyboard frame events. As the keyboard animates in, an internal `Animated.View` spacer at the bottom of the scroll content grows to match — pushing content up in sync with the keyboard, with no layout recalculation and no white flash.

### 📱 Example App

The included example app (built with Expo Router) contains a **full demo suite** with 11 professional-grade screens demonstrating:
- **Core Basics**: Login, Multi-field chains, Checkouts with dynamic skipping.
- **Hooks & Events**: Custom UI lifting with `useKeyboardHeight`, collapsing headers with `useKeyboardVisible`.
- **Advanced Layouts**: Long forms with `RefreshControl`, zero-config React Navigation integration, and rich `keyboardAccessoryView` toolbars.

To run it:
```bash
cd example
npx expo start
```

At the same time, every `FieldInput` registers itself into an ordered focus chain. When you tap Next, **FieldFlow** calls `focus()` on the next ref and runs `scrollResponderScrollNativeHandleToKeyboard` to ensure the newly focused field is visible above the keyboard — even accounting for `extraScrollPadding` so it doesn't sit flush against it.

Nothing about this requires native modules. It is entirely JS-side and works on Expo, bare RN, and the New Architecture.

### ⚡ 60fps Native Performance
**FieldFlow** strictly requires [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) as a peer dependency. By mandating Reanimated, the library delegates all keyboard layout tracking to a high-performance C++ worklet via `useAnimatedKeyboard()`. This completely bypasses the JavaScript bridge during animations, resulting in maximum UI thread performance (smooth 60fps) during heavy keyboard pan gestures that would otherwise stutter on the JS thread.

---

## API

### `<FieldForm>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `() => void` | — | Called when the last field is submitted |
| `extraScrollPadding` | `number` | `50` | Space between the active field and the keyboard top edge |
| `scrollable` | `boolean` | `true` | Wrap children in a managed ScrollView |
| `avoidKeyboard` | `boolean` | `true` | Enable the animated keyboard spacer |
| `keyboardAccessoryView` | `ReactNode` | — | Cross-platform view that hovers above the keyboard on both iOS and Android, animated in sync with the keyboard |
| `keyboardAccessoryViewMode` | `'always' \| 'whenKeyboardOpen'` | `'always'` | `'always'` — bar stays on screen at all times and lifts up; `'whenKeyboardOpen'` — bar is hidden when keyboard is closed, appears and lifts in sync when keyboard opens |
| `autoScroll` | `boolean` | `true` | Automatically scroll to the focused field |
| `chainEnabled` | `boolean` | `true` | Auto-focus next field on Next / Done |
| `autoReturnKeyType` | `boolean` | `true` | Automatically set `returnKeyType` to `next` / `done` |
| `dismissKeyboardOnTap` | `boolean` | `false` | Tapping outside any input dismisses the keyboard |
| `submitOnLastFieldDone` | `boolean` | `false` | Submit when Done is pressed on the final field |
| `scrollViewProps` | `ScrollViewProps` | — | Forwarded to the internal ScrollView |
| `keyboardVerticalOffset` | `number \| (platform) => number` | `0 / 25` | Static offset or per-platform resolver |
| `onKeyboardShow` | `(payload) => void` | — | Called when keyboard appears |
| `onKeyboardHide` | `() => void` | — | Called when keyboard dismisses |

### `<FieldInput>`

Accepts every `TextInput` prop, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `skip` | `boolean` | `false` | Exclude this field from the auto-focus chain entirely |
| `nextRef` | `RefObject<TextInput>` | — | Override: focus this ref instead of the auto-detected next field |
| `onFormSubmit` | `() => void` | — | Override: called when this field is the last and Done is tapped |

---

## Keyboard Accessory View

`keyboardAccessoryView` renders a cross-platform toolbar that floats above the keyboard and animates in **perfect sync** with it on both iOS and Android.

**Professional-grade animations:**
- **Show**: Uses a custom **exponential ease-out** curve that frontloads the motion, ensuring the bar settles exactly when the keyboard spring does — no trailing or "pushed" movement.
- **Hide (Always)**: When the keyboard closes in `always` mode, the bar uses a **spring with a subtle bounce** to settle back at the bottom, creating a natural gravity-drop feel.
- **Hide (WhenOpen)**: Stays timed with the keyboard's own dismiss animation for a coordinated exit.
- **Auto-Offset**: The component automatically detects if it's inside a Tab Bar or has other bottom insets and subtracts them from the keyboard height, so the bar always docks flush with the top of the keyboard.

The accessory height is measured automatically and injected as `paddingBottom` into the `ScrollView` so that the last field is always scrollable above the bar.

```tsx
<FieldForm
  keyboardAccessoryView={
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={Keyboard.dismiss}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  }
>
  <FieldInput placeholder="Message..." />
</FieldForm>
```

### `keyboardAccessoryViewMode`

| Value | Behaviour |
|-------|-----------|
| `'always'` *(default)* | Bar always visible at the bottom; slides up when keyboard opens and back down when it closes |
| `'whenKeyboardOpen'` | Bar is hidden when no keyboard is shown; fades in and slides up as keyboard opens; fades out and slides down as keyboard closes |

```tsx
// Bar is always visible — use for persistent action bars / send buttons
<FieldForm
  keyboardAccessoryView={<Toolbar />}
  keyboardAccessoryViewMode="always"
/>

// Bar only appears with the keyboard — use for formatting toolbars
<FieldForm
  keyboardAccessoryView={<Toolbar />}
  keyboardAccessoryViewMode="whenKeyboardOpen"
/>
```

---

### Hooks

```tsx
import { useKeyboardHeight, useKeyboardVisible } from 'react-native-fieldflow';

const height  = useKeyboardHeight();   // number — 0 when hidden
const visible = useKeyboardVisible();  // boolean
```

Both hooks use `keyboardWillShow` / `keyboardWillHide` on iOS (smooth, frame-synchronised) and `keyboardDidShow` / `keyboardDidHide` on Android. No polling, no timers.

**Example — button that lifts above the keyboard:**

```tsx
function SubmitButton() {
  const height = useKeyboardHeight();

  return (
    <Animated.View style={{ marginBottom: height }}>
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

---

## Comparison

<table>
<thead>
<tr>
<th></th>
<th align="center"><code>KeyboardAvoidingView</code></th>
<th align="center"><code>keyboard-aware-scroll-view</code></th>
<th align="center" style="background-color:#6366f1;color:#ffffff;padding:8px 20px">✦ &nbsp;FieldFlow</th>
</tr>
</thead>
<tbody>
<tr>
<td>No layout jumps</td>
<td align="left">❌</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">⚠️ <span>Sometimes</span></span></td>
<td align="left">✅</td>
</tr>
<tr>
<td>Identical iOS + Android</td>
<td align="left">❌</td>
<td align="left">⚠️</td>
<td align="left">✅</td>
</tr>
<tr>
<td>Auto Next / Done</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><b><span style="display:inline-flex;align-items:center;gap:5px">✅ <span>Automatic</span></span></b></td>
</tr>
<tr>
<td>Ref management</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><b><span style="display:inline-flex;align-items:center;gap:5px">✅ <span>Zero</span></span></b></td>
</tr>
<tr>
<td>Works with Expo</td>
<td align="left">✅</td>
<td align="left">✅</td>
<td align="left">✅</td>
</tr>
<tr>
<td>New Architecture (Fabric)</td>
<td align="left">✅</td>
<td align="left">⚠️</td>
<td align="left">✅</td>
</tr>
<tr>
<td>Native modules</td>
<td align="left">None</td>
<td align="left">None</td>
<td align="left">None</td>
</tr>
</tbody>
</table>
---

## Common questions

<details>
<summary><b>Does it work with React Navigation?</b></summary>
<br/>

Yes. **FieldFlow** measures available window height rather than screen height, so it accounts for headers, tab bars, and any custom chrome automatically. No `keyboardVerticalOffset` guessing required.
</details>

<details>
<summary><b>What if I have a custom Input component?</b></summary>
<br/>

As long as your component forwards its ref with `forwardRef` and renders a `FieldInput` internally, it is picked up by the chain automatically. Nothing special needed.

```tsx
const MyInput = forwardRef<TextInput, MyInputProps>((props, ref) => (
  <View>
    <Text>{props.label}</Text>
    <FieldInput ref={ref} {...props} />
  </View>
));
```
</details>

<details>
<summary><b>Can I skip a field in the chain?</b></summary>
<br/>

Yes. Add `skip={true}` to any `FieldInput` and the focus chain skips over it dynamically. The field is still fully functional — it just doesn't participate in Next/Done handling.
</details>

<details>
<summary><b>Can I manually control which field comes next?</b></summary>
<br/>

Yes. Pass a `nextRef` to any `FieldInput` to override the auto-detected next field. Useful when your field order doesn't match the visual layout.

```tsx
const notesRef = useRef<TextInput>(null);

<FieldInput placeholder="Email" nextRef={notesRef} />
<FieldInput placeholder="Phone" />                    {/* skipped */}
<FieldInput placeholder="Notes" ref={notesRef} />
```
</details>

<details>
<summary><b>Does it support the New Architecture (Fabric)?</b></summary>
<br/>

Yes. **FieldFlow** uses `Animated`, `Keyboard`, and standard event listeners — all of which are fully supported on both architectures.
</details>

---

## Contributing

Bug reports, feature requests, and pull requests are all welcome.

If you find an edge case — a device, a navigation setup, a keyboard type that breaks the chain — please open an issue with a minimal reproduction. That's the most valuable contribution you can make.

- [Contributing guide](CONTRIBUTING.md)
- [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml)

---

<div align="center">

If **FieldFlow** saves you time, a star helps other developers find it.

**[⭐ Star on GitHub](https://github.com/SyedSohaib456/react-native-fieldflow)**

<br/>

MIT © [Syed Sohaib](https://github.com/SyedSohaib456)

</div>

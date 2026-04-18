<div align="center">

<br/>

<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/logo.png" alt="FieldFlow" width="300" />

<br/>
<br/>

<h3>Keyboard avoidance · Auto focus chaining · Accessory toolbars</h3>
<p><em>Two components. Zero boilerplate. One less headache.</em></p>

<br/>

[![npm](https://img.shields.io/npm/v/react-native-fieldflow?color=6366f1&style=flat-square)](https://www.npmjs.com/package/react-native-fieldflow)
[![React Native](https://img.shields.io/badge/React%20Native-%3E%3D0.68-61dafb?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-compatible-000020?style=flat-square&logo=expo)](https://expo.dev)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/SyedSohaib456/react-native-fieldflow?color=facc15&style=flat-square&logo=github&label=stars)](https://github.com/SyedSohaib456/react-native-fieldflow/stargazers)

<br/>

⭐ **If this saves you time, consider [starring the repo](https://github.com/SyedSohaib456/react-native-fieldflow) — it helps other developers find it.**

</div>

---

## 📱 Demo

<div align="flex-start">
<table>
<tr>
<td align="center"><b>Focus Chaining — iOS</b></td>
<td align="center"><b>Focus Chaining — Android</b></td>
</tr>
<tr>
<td align="center">

<br/>
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/gif/signupiOS.gif" width="50%" alt="iOS Focus Chaining" />
<br/>

</td>
<td align="center">

<br/>
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/gif/signupAndroid.gif" width="50%" alt="Android Focus Chaining" />
<br/>

</td>
</tr>
<tr>
<td align="center"><b>Accessory Toolbar — iOS</b></td>
<td align="center"><b>Accessory Toolbar — Android</b></td>
</tr>
<tr>
<td align="center">

<br/>
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/gif/accessoryiOS.gif" width="250" alt="iOS Accessory View" />
<br/>

</td>
<td align="center">

<br/>
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/gif/accessoryAndroid.gif" width="250" alt="Android Accessory View" />
<br/>

</td>
</tr>
</table>
</div>

---

## 📦 Installation

```sh
npm install react-native-fieldflow
```

> **Requirements:** React Native ≥ 0.68 · [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) · Expo & bare RN supported · Zero native modules · No `pod install`

---

## ⚡ Quick Start

Drop `FieldForm` and `FieldInput` into any screen. Focus chaining, keyboard avoidance, and return key types are all handled automatically.

```tsx
import { FieldForm, FieldInput } from "react-native-fieldflow";

export default function SignUpScreen() {
  return (
    <FieldForm onSubmit={handleSubmit}>
      <FieldInput placeholder="Full name" textContentType="name" />
      <FieldInput
        placeholder="Email"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FieldInput
        placeholder="Phone"
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
      />
      <FieldInput
        placeholder="Password"
        textContentType="newPassword"
        secureTextEntry
      />
      <FieldInput
        placeholder="Confirm password"
        textContentType="newPassword"
        secureTextEntry
      />
    </FieldForm>
  );
}
```

**What you get for free:**

|                           |                                                                     |
| ------------------------- | ------------------------------------------------------------------- |
| 🔗 **Focus chaining**     | Fields 1–4 get `returnKeyType="next"`, the last field gets `"done"` |
| ⌨️ **Keyboard avoidance** | Smooth 60fps layout shift via Reanimated worklet — no jumps         |
| 📜 **Auto scroll**        | Focused field is always scrolled into view above the keyboard       |
| 📱 **Cross-platform**     | Identical behavior on iOS and Android, no `Platform.OS` switches    |

---

## 🔄 Before & After

#### ❌ Without FieldFlow — 5 refs · 5 wired handlers · platform switches · 40+ lines

```tsx
const nameRef = useRef<TextInput>(null);
const emailRef = useRef<TextInput>(null);
const phoneRef = useRef<TextInput>(null);
const passRef = useRef<TextInput>(null);
const confirmRef = useRef<TextInput>(null);

<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <TextInput
      ref={nameRef}
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => emailRef.current?.focus()}
    />
    <TextInput
      ref={emailRef}
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => phoneRef.current?.focus()}
    />
    <TextInput
      ref={phoneRef}
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => passRef.current?.focus()}
    />
    <TextInput
      ref={passRef}
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => confirmRef.current?.focus()}
    />
    <TextInput
      ref={confirmRef}
      returnKeyType="done"
      onSubmitEditing={handleSubmit}
    />
  </ScrollView>
</KeyboardAvoidingView>;
```

#### ✅ With FieldFlow — 0 refs · 0 handlers · 0 platform switches · 8 lines

```tsx
import { FieldForm, FieldInput } from "react-native-fieldflow";

<FieldForm onSubmit={handleSubmit}>
  <FieldInput placeholder="Full name" />
  <FieldInput
    placeholder="Email"
    keyboardType="email-address"
    autoCapitalize="none"
  />
  <FieldInput placeholder="Phone" keyboardType="phone-pad" />
  <FieldInput placeholder="Password" secureTextEntry />
  <FieldInput placeholder="Confirm" secureTextEntry />
</FieldForm>;
```

---

## 🏗 How It Works

<div align="center">
<img src="https://raw.githubusercontent.com/SyedSohaib456/react-native-fieldflow/main/media/architecture.png" width="560" alt="FieldFlow architecture" />
</div>

<br/>

| Layer                 | What happens                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard tracking** | `useAnimatedKeyboard()` runs on the UI thread via a C++ Reanimated worklet — zero JS bridge involvement during keyboard animation                  |
| **Spacer**            | An `Animated.View` at the bottom of the scroll content grows to match the keyboard frame, pushing content up in sync                               |
| **Focus chain**       | Every `FieldInput` registers itself into an ordered list; tapping Next calls `focus()` on the next ref and scrolls it into view above the keyboard |
| **Submit**            | The last field's Done button calls `onSubmit` and dismisses the keyboard                                                                           |

> Everything runs in JS — no native modules required. Works on Expo, bare RN, and New Architecture (Fabric).

---

## 📖 API Reference

### `<FieldForm>`

The wrapper component that manages keyboard avoidance, scroll behavior, and the focus chain.

| Prop                        | Type                             | Default    | Description                                                                                       |
| --------------------------- | -------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `onSubmit`                  | `() => void`                     | —          | Called when the last field's Done is tapped                                                       |
| `extraScrollPadding`        | `number`                         | `140`      | Gap (px) between the active field and the keyboard top edge                                       |
| `scrollable`                | `boolean`                        | `true`     | Wrap children in a managed `ScrollView`                                                           |
| `avoidKeyboard`             | `boolean`                        | `true`     | Enable the animated keyboard spacer                                                               |
| `keyboardAccessoryView`     | `ReactNode`                      | —          | Toolbar that floats above the keyboard on both platforms                                          |
| `keyboardAccessoryViewMode` | `'always' \| 'whenKeyboardOpen'` | `'always'` | `always` — always visible, lifts with keyboard · `whenKeyboardOpen` — hidden until keyboard opens |
| `autoScroll`                | `boolean`                        | `true`     | Scroll to focused field automatically                                                             |
| `chainEnabled`              | `boolean`                        | `true`     | Auto-focus next field on Next / Done                                                              |
| `autoReturnKeyType`         | `boolean`                        | `true`     | Auto-set `returnKeyType` to `next` / `done`                                                       |
| `dismissKeyboardOnTap`      | `boolean`                        | `false`    | Tap outside any input to dismiss the keyboard                                                     |
| `submitOnLastFieldDone`     | `boolean`                        | `false`    | Call `onSubmit` when Done is pressed on the final field                                           |
| `chatMode`                  | `boolean`                        | `false`    | High-performance mode for chat screens — bypasses padding and uses native `scrollToEnd()`         |
| `scrollViewProps`           | `ScrollViewProps`                | —          | Forwarded directly to the internal `ScrollView`                                                   |
| `keyboardVerticalOffset`    | `number \| (platform) => number` | `0 / 25`   | Static offset or per-platform resolver function                                                   |
| `onKeyboardShow`            | `(payload) => void`              | —          | Fired when keyboard appears                                                                       |
| `onKeyboardHide`            | `() => void`                     | —          | Fired when keyboard dismisses                                                                     |

---

### `<FieldInput>`

A drop-in replacement for `TextInput`. Accepts **all** standard `TextInput` props, plus:

| Prop               | Type                   | Default | Description                                                                                    |
| ------------------ | ---------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `skip`             | `boolean`              | `false` | Exclude this field from the auto-focus chain                                                   |
| `nextRef`          | `RefObject<TextInput>` | —       | Override: focus a specific ref instead of the next detected field                              |
| `onFormSubmit`     | `() => void`           | —       | Override: called when this is the last field and Done is tapped                                |
| `isAccessoryField` | `boolean`              | `false` | Set to `true` if this input lives inside `keyboardAccessoryView` to bypass scroll measurements |

---

## 🎹 Keyboard Accessory View

A cross-platform floating toolbar, animated in sync with the keyboard on both iOS and Android.

```tsx
<FieldForm
  keyboardAccessoryView={
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={Keyboard.dismiss}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  }
  keyboardAccessoryViewMode="whenKeyboardOpen"
>
  <FieldInput placeholder="Message..." />
</FieldForm>
```

| Mode                   | Behavior                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `'always'` _(default)_ | Bar is always visible; slides up when the keyboard opens, back down when it closes        |
| `'whenKeyboardOpen'`   | Bar is hidden when the keyboard is closed; fades in and slides up when the keyboard opens |

**Animation details:** Appearance uses an exponential ease-out curve so the bar settles exactly when the keyboard spring does. Dismissal in `always` mode uses a subtle spring bounce for a natural gravity-drop feel. Bar height is auto-measured and injected as `paddingBottom` on the `ScrollView` so the last field is always reachable.

---

## 🪝 Hooks

Two lightweight hooks for when you need keyboard state outside of `FieldForm`.

```tsx
import { useKeyboardHeight, useKeyboardVisible } from "react-native-fieldflow";

const height = useKeyboardHeight(); // number — 0 when keyboard is hidden
const visible = useKeyboardVisible(); // boolean
```

Both hooks use `keyboardWillShow` / `keyboardWillHide` on iOS and `keyboardDidShow` / `keyboardDidHide` on Android. No polling, no timers.

**Example — a submit button that lifts above the keyboard:**

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

## 📊 Comparison

<table>
<thead>
<tr>
<th>Feature</th>
<th align="center"><code>KeyboardAvoidingView</code></th>
<th align="center"><code>keyboard-aware-scroll-view</code></th>
<th align="center"><code>keyboard-controller</code></th>
<th align="center" style="background-color:#6366f1;color:#ffffff;padding:8px 20px;border-radius:6px">✦ &nbsp;FieldFlow</th>
</tr>
</thead>
<tbody>
<tr>
<td>Zero native modules</td>
<td align="left">✅</td>
<td align="left">✅</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Custom C++ module</span></span></td>
<td align="left">✅</td>
</tr>
<tr>
<td>No layout jumps</td>
<td align="left">❌</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">⚠️ <span>Sometimes</span></span></td>
<td align="left">✅</td>
<td align="left">✅</td>
</tr>
<tr>
<td>Identical iOS + Android</td>
<td align="left">❌</td>
<td align="left">⚠️</td>
<td align="left">✅</td>
<td align="left">✅</td>
</tr>
<tr>
<td>Auto Next / Done keys</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><b><span style="display:inline-flex;align-items:center;gap:5px">✅ <span>Auto</span></span></b></td>
</tr>
<tr>
<td>Ref management</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">❌ <span>Manual</span></span></td>
<td align="left"><b><span style="display:inline-flex;align-items:center;gap:5px">✅ <span>Zero</span></span></b></td>
</tr>
<tr>
<td>Expo compatible</td>
<td align="left">✅</td>
<td align="left">✅</td>
<td align="left"><span style="display:inline-flex;align-items:center;gap:5px">✅ <span>via plugin</span></span></td>
<td align="left">✅</td>
</tr>
<tr>
<td>New Architecture (Fabric)</td>
<td align="left">✅</td>
<td align="left">⚠️</td>
<td align="left">✅</td>
<td align="left">✅</td>
</tr>
</tbody>
</table>

---

## ❓ FAQ

<details>
<summary><b>Does it work with React Navigation?</b></summary>

<br/>

Yes. FieldFlow measures the available **window height**, not screen height, so headers, tab bars, and custom chrome are accounted for automatically. No `keyboardVerticalOffset` guessing needed.

</details>

<details>
<summary><b>What if I have a custom Input component?</b></summary>

<br/>

Wrap it with `forwardRef` and render `FieldInput` internally — it's picked up by the chain automatically.

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

Yes. Add `skip={true}` to any `FieldInput`. The field remains fully functional — it just doesn't participate in Next/Done handling.

</details>

<details>
<summary><b>Can I manually control which field comes next?</b></summary>

<br/>

Yes. Pass a `nextRef` to override the auto-detected next field.

```tsx
const notesRef = useRef<TextInput>(null);

<FieldInput placeholder="Email" nextRef={notesRef} />
<FieldInput placeholder="Phone" skip />
<FieldInput placeholder="Notes" ref={notesRef} />
```

</details>

<details>
<summary><b>Does it support the New Architecture (Fabric)?</b></summary>

<br/>

Yes. FieldFlow uses `Animated`, `Keyboard`, and standard event listeners — all fully supported on both the old and new React Native architectures.

</details>

---

## 🧪 Example App

An Expo Router example app ships with **11 demo screens** covering real-world patterns:

```sh
cd example
npx expo start
```

| Screen            | What it demonstrates                         |
| ----------------- | -------------------------------------------- |
| Login / Sign-up   | Basic focus chaining                         |
| Checkout          | Dynamic field skipping with `nextRef`        |
| Chat              | `chatMode` + `keyboardAccessoryView` toolbar |
| Long form         | `RefreshControl` + auto-scroll               |
| Collapsing header | Scroll-linked animated header                |
| Hooks demo        | `useKeyboardHeight` + `useKeyboardVisible`   |
| React Navigation  | Header offset handling                       |

---

## 🤝 Contributing

Bug reports, feature requests, and pull requests are all welcome.

If you find an edge case — a device, navigation setup, or keyboard type that breaks the chain — please open an issue with a minimal reproduction.

- 📋 [Contributing guide](CONTRIBUTING.md)
- 🐛 [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml)
- 💡 [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml)

---

<div align="center">

<br/>

MIT © [Syed Sohaib](https://github.com/SyedSohaib456)

<br/>

**[⭐ Star on GitHub](https://github.com/SyedSohaib456/react-native-fieldflow)** — helps other developers discover this.

</div>

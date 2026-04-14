<div align="center">
  <h1>🌊 React Native FieldFlow</h1>
  <p><b>The Ultimate Zero-Dependency Form & Keyboard Management Engine for React Native</b></p>
  
  <p>
    <a href="https://www.npmjs.com/package/react-native-fieldflow"><img src="https://img.shields.io/npm/v/react-native-fieldflow?color=008080&style=for-the-badge" alt="npm version"></a>
    <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey?style=for-the-badge" alt="Platforms">
    <img src="https://img.shields.io/badge/Expo_Go-Supported-000020?style=for-the-badge&logo=expo" alt="Expo Go">
    <img src="https://img.shields.io/badge/types-TypeScript-blue?style=for-the-badge" alt="TypeScript">
  </p>
</div>

---

**React Native FieldFlow** is an all-in-one, ultra-performant, zero-native-dependency library that solves the two biggest headaches in mobile development: **Forms** and **Keyboard Avoidance**. 

Stop stringing together five different libraries for keyboard tracking, form state, validation, focus chains, and UI components. FieldFlow gives you a buttery-smooth, 60fps experience out of the box with zero native linking required.

## 🚀 Why FieldFlow? 

Handling the keyboard in React Native has historically been a nightmare. `KeyboardAvoidingView` is notorious for breaking nested layouts, and modern alternatives require heavy JSI C++ native modules that bloat your app and kill Expo Go compatibility.

**FieldFlow takes a different approach:**
By utilizing highly optimized React Native `Animated.spring` physics, native layout measuring, and a localized reactive state engine, FieldFlow achieves **perfect 60fps keyboard avoidance** entirely on the JS thread without dropping a single frame.

### 🥊 FieldFlow vs. `react-native-keyboard-controller`

If you are currently evaluating `react-native-keyboard-controller` (RNKC), here is why FieldFlow is the superior choice for most production apps:

| Feature/Metric | 🌊 FieldFlow | ⌨️ `react-native-keyboard-controller` |
| :--- | :--- | :--- |
| **Native Dependencies** | **None (Pure JS/TS)** | Heavy C++ / JSI Native Modules |
| **Expo Environment** | **Works in Expo Go instantly** | Requires Expo Prebuild (Dev Clients) |
| **Performance (FPS)** | **60 FPS** (Native driver spring physics) | **60 FPS** (JSI synchronous listeners) |
| **Bundle Size / Build Time** | **Tiny / Instant** | Bloated / Slower iOS/Android compilation |
| **Scope of Library** | **Full Form Engine** (State, Validation, Focus, UI) | **Keyboard Avoidance Only** |
| **Focus Chain Management** | **Automatic Next/Prev field focus** | Manual implementation required |
| **Validation Handling** | **Built-in Async & Sync Validation** | None (Bring your own) |

**The Verdict:** While RNKC is a great engineering feat using JSI, it only solves half the problem (the keyboard) while introducing significant native complexity. FieldFlow solves the *entire* user input experience—from keyboard avoidance to form submission—with zero native overhead, ensuring your app stays lightweight and rock-solid.

## ✨ Features

- **🛡️ Butter-Smooth Keyboard Avoidance:** Native-feeling spring physics that gracefully glide your inputs above the keyboard. No stuttering, no frame drops.
- **🔗 Automatic Focus Chains:** Press "Next" on the keyboard. FieldFlow automatically finds and focuses the next logical input.
- **📦 Zero Native Code:** Install and run immediately. No `pod install`, no JSI crashes, full Expo Go support.
- **✅ Built-in Validation Engine:** First-class support for sync/async validation (Zod, Yup, or custom rules) out of the box.
- **🎨 Beautiful Pre-built Fields:** Includes ready-to-use, fully themeable components: `FieldInput`, `FieldTags`, `FieldSelect`, `FieldOTP`, `FieldAmount`, `FieldDate`, and `FieldPassword`.
- **⚡ Reactive State Management:** Powered internally by a lightweight Zustand store. Only re-renders exactly what changed.
- **📳 Haptics Integration:** Integrated tactile feedback for focus, errors, and success states.

## 📦 Installation

```bash
# npm
npm install react-native-fieldflow

# yarn
yarn add react-native-fieldflow

# bun
bun add react-native-fieldflow
```

*Optional Peer Dependencies (for advanced features):*
- `expo-haptics` or `react-native-haptic-feedback` (for vibrations)
- `@react-native-community/datetimepicker` (for `FieldDate`)

## 💻 Quick Start

Replace your messy ScrollViews and State variables with a simple, declarative `<FieldForm>`.

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { FieldForm, FieldInput, FieldPassword } from 'react-native-fieldflow';

export default function LoginScreen() {
  const handleFinish = (values) => {
    console.log('Form Submitted!', values);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* FieldForm automatically handles Keyboard Avoidance & Scrolling */}
      <FieldForm onFinish={handleFinish} extraScrollPadding={40}>
        
        <FieldInput
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          rules={{ required: true, email: true }}
        />

        <FieldPassword
          name="password"
          label="Password"
          placeholder="Enter your password"
          rules={{ required: true, minLength: 8 }}
        />

        {/* This button will trigger validation and submission */}
        <Button title="Login" onPress={() => {}} />

      </FieldForm>
    </View>
  );
}
```

## 🏗️ Core Architecture

### `FieldForm`
The brain of your UI. It provides the Context, initializes the reactive store, measures child coordinates, and orchestrates the smooth spring animations that avoid the keyboard. 
- Props like `extraScrollPadding` allow you to visually tune how high the form pushes up when the keyboard appears.

### The Focus Engine
Fields register themselves with the form asynchronously. When a user presses "Return", the engine calculates the dom-tree order and automatically focuses the next input, even if it's deeply nested.

### High-Performance Components
Instead of basic TextInputs, FieldFlow provides smart wrappers. For example, `FieldTags` measures its dynamic height correctly for keyboard avoidance, and `FieldSelect` triggers scrolling before rendering its options sheet to guarantee visibility.

## 🎨 Theming & Styling

FieldFlow components are un-opinionated but look premium by default. You can pass a global theme to `FieldForm` or style individual components natively via `containerStyle`, `inputStyle`, `labelStyle`, and `errorStyle`.

```tsx
<FieldForm 
  theme={{
    colors: { primary: '#6366F1', error: '#EF4444' },
    borderRadius: 12,
  }}
>
  ...
</FieldForm>
```

## 📚 Component Overview

- `<FieldInput />`: Your daily workhorse. Supports icons, labels, and built-in error states.
- `<FieldPassword />`: Secure input with built-in eye-toggle visibility.
- `<FieldSelect />`: Beautiful bottom-sheet driven selection logic.
- `<FieldDate />`: Integrated DateTimePicker with haptic support.
- `<FieldTags />`: Dynamic multiselect pill-tags (expanding height managed automatically).
- `<FieldOTP />`: Segmented One-Time-Password boxes with auto-paste support.
- `<FieldAmount />`: Professional currency formatter input.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

MIT License - copyright © 2026 Syed Sohaib.

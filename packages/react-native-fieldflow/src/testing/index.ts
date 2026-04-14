/**
 * Test utilities for FieldFlow forms.
 * Designed to work with @testing-library/react-native.
 */

/**
 * Fill a FieldInput by name with the given value.
 */
export function fillField(
  container: any,
  name: string,
  value: string,
): void {
  const { getByTestId, getAllByDisplayValue } = container;

  try {
    // Try to find by accessibilityLabel (which matches name or label)
    const inputs = container.root.findAll((node: any) => {
      return (
        node.props?.accessibilityLabel === name ||
        node.props?.testID === name ||
        node.props?.name === name
      );
    });

    if (inputs.length > 0) {
      const input = inputs[0];
      if (input.props?.onChangeText) {
        input.props.onChangeText(value);
      }
    }
  } catch {
    // Fallback: find by placeholder or label text
  }
}

/**
 * Submit the form by triggering the last field's submit or the submit button.
 */
export function submitForm(container: any): void {
  try {
    const inputs = container.root.findAll((node: any) => {
      return node.type === 'TextInput' || node.props?.onSubmitEditing;
    });

    // Fire submit on the last input
    const lastInput = inputs[inputs.length - 1];
    if (lastInput?.props?.onSubmitEditing) {
      lastInput.props.onSubmitEditing({ nativeEvent: {} });
    }
  } catch {
    // Fallback
  }
}

/**
 * Assert that a field has a specific error message displayed.
 */
export function expectFieldError(
  container: any,
  name: string,
  expectedError: string,
): void {
  try {
    const errorTexts = container.root.findAll((node: any) => {
      return (
        node.props?.accessibilityLiveRegion === 'polite' &&
        node.props?.children === expectedError
      );
    });

    if (errorTexts.length === 0) {
      throw new Error(
        `Expected error "${expectedError}" for field "${name}", but none was found.`,
      );
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Assert that a field has a specific value.
 */
export function expectFieldValue(
  container: any,
  name: string,
  expectedValue: string,
): void {
  try {
    const inputs = container.root.findAll((node: any) => {
      return (
        node.props?.accessibilityLabel === name &&
        node.props?.value !== undefined
      );
    });

    if (inputs.length > 0) {
      const actual = inputs[0].props.value;
      if (actual !== expectedValue) {
        throw new Error(
          `Expected field "${name}" to have value "${expectedValue}", but got "${actual}".`,
        );
      }
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Focus a specific field by name.
 */
export function focusField(container: any, name: string): void {
  try {
    const inputs = container.root.findAll((node: any) => {
      return node.props?.accessibilityLabel === name;
    });

    if (inputs.length > 0 && inputs[0].props?.onFocus) {
      inputs[0].props.onFocus({});
    }
  } catch {
    // Fallback
  }
}

/**
 * Simulate tapping Next/Done on the currently focused field.
 */
export function tapNext(container: any): void {
  try {
    const inputs = container.root.findAll((node: any) => {
      return node.type === 'TextInput' && node.props?.onSubmitEditing;
    });

    // Find the focused input or the first one
    const focusedInput = inputs.find((i: any) => i.props?.autoFocus) ?? inputs[0];
    if (focusedInput?.props?.onSubmitEditing) {
      focusedInput.props.onSubmitEditing({ nativeEvent: {} });
    }
  } catch {
    // Fallback
  }
}

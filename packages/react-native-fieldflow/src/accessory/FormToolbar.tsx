/**
 * FormToolbar — Prev / Field Label / Next + Done toolbar.
 * Floats above the keyboard, taps into focus chain.
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFieldFlowContext, useFocusedField } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { dismissKeyboard } from '../keyboard/hooks';
import type { FormToolbarProps } from '../types';

export function FormToolbar(props: FormToolbarProps) {
  const {
    renderPrev,
    renderNext,
    renderDone,
    renderCenter,
    renderActions,
    containerStyle,
    buttonStyle,
    labelStyle,
  } = props;

  const ctx = useFieldFlowContext();
  const theme = useTheme();
  const focused = useFocusedField();

  const handlePrev = useCallback(() => {
    if (ctx && focused.name) {
      ctx.focusPrev(focused.name);
    }
  }, [ctx, focused.name]);

  const handleNext = useCallback(() => {
    if (ctx && focused.name) {
      ctx.focusNext(focused.name);
    }
  }, [ctx, focused.name]);

  const handleDone = useCallback(() => {
    dismissKeyboard();
  }, []);

  if (!ctx || !focused.name) return null;

  const isFirst = focused.name ? ctx.isFirstField(focused.name) : true;
  const isLast = focused.name ? ctx.isLastField(focused.name) : true;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.toolbar,
          borderTopColor: theme.colors.toolbarBorder,
        },
        containerStyle,
      ]}
    >
      {/* Prev */}
      {!isFirst ? (
        renderPrev ? renderPrev(handlePrev) : (
          <TouchableOpacity
            onPress={handlePrev}
            style={[styles.button, buttonStyle]}
            accessibilityLabel="Previous field"
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: theme.colors.toolbarButton }]}>‹ Prev</Text>
          </TouchableOpacity>
        )
      ) : (
        <View style={styles.button} />
      )}

      {/* Center — Field label */}
      {renderCenter ? (
        renderCenter(focused.label ?? focused.name ?? '')
      ) : (
        <Text
          style={[
            styles.label,
            { color: theme.colors.label, fontFamily: theme.fontFamily || undefined },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {focused.label ?? focused.name}
        </Text>
      )}

      {/* Actions slot */}
      {renderActions ? renderActions() : null}

      {/* Next / Done */}
      {!isLast ? (
        renderNext ? renderNext(handleNext) : (
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, buttonStyle]}
            accessibilityLabel="Next field"
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: theme.colors.toolbarButton }]}>Next ›</Text>
          </TouchableOpacity>
        )
      ) : (
        renderDone ? renderDone(handleDone) : (
          <TouchableOpacity
            onPress={handleDone}
            style={[styles.button, buttonStyle]}
            accessibilityLabel="Done"
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, styles.doneText, { color: theme.colors.toolbarButton }]}>Done</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

FormToolbar.displayName = 'FormToolbar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopWidth: 1,
    paddingHorizontal: 12,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 60,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  doneText: {
    fontWeight: '700',
    textAlign: 'right',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

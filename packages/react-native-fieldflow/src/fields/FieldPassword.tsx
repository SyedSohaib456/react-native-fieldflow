import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import { FieldPasswordProps } from '../types';
import { FieldInput } from './FieldInput';

export const FieldPassword = forwardRef<TextInput, FieldPasswordProps>((props, ref) => {
  const {
    rightIcon,
    ...rest
  } = props;

  const theme = useTheme();
  const [secure, setSecure] = useState(true);

  const toggleSecure = useCallback(() => {
    setSecure((s) => !s);
    if (theme.hapticStyle) triggerHaptic('light');
  }, [theme.hapticStyle]);

  const passwordRightIcon = (
    <View style={styles.rightContainer}>
      <Pressable onPress={toggleSecure} style={styles.toggle}>
        <Ionicons
          name={secure ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          color={theme.colors.placeholder}
        />
      </Pressable>
      {rightIcon}
    </View>
  );

  return (
    <FieldInput
      {...rest}
      ref={ref}
      secureTextEntry={secure}
      rightIcon={passwordRightIcon}
      rightIconStyle={{ marginRight: 0 }} // Let the container handle padding
    />
  );
});

FieldPassword.displayName = 'FieldPassword';

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    padding: 4,
    marginRight: 4,
  },
});

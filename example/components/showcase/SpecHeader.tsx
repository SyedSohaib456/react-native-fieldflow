import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShowcaseColors as C, ShowcaseSpacing as S } from '../../constants/showcase-theme';

interface SpecHeaderProps {
  title: string;
  subtitle?: string;
  dark?: boolean;
}

export const SpecHeader: React.FC<SpecHeaderProps> = ({ title, subtitle, dark }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: Math.max(insets.top, 16),
        backgroundColor: dark ? C.velaNavy : C.bgPrimary 
      },
    ]}>
      <Text style={[styles.title, dark && styles.textDark]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, dark && styles.subtitleDark]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: S.xl,
    paddingBottom: S.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: C.textSecondary,
    marginTop: 4,
    lineHeight: 22,
  },
  subtitleDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

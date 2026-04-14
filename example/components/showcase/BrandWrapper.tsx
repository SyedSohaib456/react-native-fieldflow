import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ShowcaseColors as C } from '../../constants/showcase-theme';

interface BrandWrapperProps {
  children: React.ReactNode;
  brandColor?: string;
  style?: ViewStyle;
}

export const BrandWrapper: React.FC<BrandWrapperProps> = ({ children, brandColor, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
});

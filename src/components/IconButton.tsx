import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'filled' | 'ghost';
  style?: ViewStyle;
  accessibilityLabel?: string;
};

/** Nút vuông bo góc chứa một icon */
export default function IconButton({
  children,
  onPress,
  size = 40,
  variant = 'filled',
  style,
  accessibilityLabel,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={[
        styles.base,
        { width: size, height: size },
        variant === 'filled' && styles.filled,
        style,
      ]}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  filled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

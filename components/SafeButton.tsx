import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Radius, Typography } from '../constants/theme';

interface SafeButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'light';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  rightIcon?: React.ReactNode;
}

export const SafeButton: React.FC<SafeButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  style,
  textStyle,
  rightIcon,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const labelStyle: TextStyle[] = [
    styles.label,
    styles[`label_${variant}`],
    textStyle as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.textLight : Colors.primary}
          size="small"
        />
      ) : (
        <>
          <Text style={labelStyle}>{label}</Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    gap: 8,
  },
  // Sizes
  size_sm: { paddingVertical: 10, paddingHorizontal: 20 },
  size_md: { paddingVertical: 14, paddingHorizontal: 28 },
  size_lg: { paddingVertical: 17, paddingHorizontal: 32 },

  // Variants
  variant_primary: {
    backgroundColor: Colors.primary,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_light: {
    backgroundColor: Colors.primaryLight,
  },

  // Labels
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  label_primary: { color: Colors.textLight },
  label_outline: { color: Colors.primary },
  label_ghost: { color: Colors.primary },
  label_light: { color: Colors.textLight },

  disabled: { opacity: 0.5 },
});

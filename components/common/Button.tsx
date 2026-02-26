import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { type ButtonProps, ButtonVariant } from '@/types/components';

const ButtonComponent = ({
  variant = ButtonVariant.Primary,
  onPress,
  disabled = false,
  children,
  style,
}: ButtonProps) => {
  const isPrimary = variant === ButtonVariant.Primary;
  const isSecondary = variant === ButtonVariant.Secondary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isPrimary && pressed && styles.primaryPressed,
        isSecondary && styles.secondary,
        isSecondary && pressed && styles.secondaryPressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.primaryText,
          isSecondary && styles.secondaryText,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2563EB',
  },
  primaryPressed: {
    backgroundColor: '#1D4ED8',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondary: {
    backgroundColor: '#374151',
  },
  secondaryPressed: {
    backgroundColor: '#4B5563',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

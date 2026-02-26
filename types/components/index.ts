import {
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export interface ButtonProps {
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  children: string;
  style?: StyleProp<ViewStyle>;
}

export interface InputProps extends Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'onBlur'
  | 'placeholder'
  | 'secureTextEntry'
  | 'keyboardType'
  | 'autoComplete'
> {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';


import { useTheme } from '../hooks/useTheme'

interface Props extends Omit<TextInputProps, 'right'> {
  invalid?: boolean;
  right?: string | React.ReactNode;
  onRightPress?: () => void;
}

const Input = React.forwardRef(
  ({ invalid = false, right, disabled = false, ...otherProps }: Props, ref: any) => {
    const { colors, roundness } = useTheme();

    return (
      <TextInput
        ref={ref}
        mode="outlined"
        disabled={disabled}
        maxFontSizeMultiplier={1}
        error={invalid || otherProps.error}
        outlineStyle={{ borderRadius: roundness * 4 }}
        // activeOutlineColor={colors.primary}
        outlineColor={colors.outlineVariant}
        // textColor={colors.onBackground}
        placeholderTextColor={colors.outlineVariant}
        
        right={
          typeof right === 'string' ? (
            <TextInput.Icon onPress={otherProps.onRightPress} icon={right} />
          ) : (
            right
          )
        }
        {...otherProps}
      />
    );
  },
);
export default Input;

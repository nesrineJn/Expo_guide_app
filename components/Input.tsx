import { colors } from '@/utils/constants';
import React from 'react';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

interface Props extends Omit<TextInputProps, 'right'> {
  invalid?: boolean;
  right?: string | React.ReactNode;
  onRightPress?: () => void;
}

const Input = React.forwardRef(
  ({ invalid = false, right, disabled = false, style, ...otherProps }: Props, ref: any) => {
    const { roundness } = useTheme();

    return (
      <TextInput
        ref={ref}
        mode="outlined"
        disabled={disabled}
        maxFontSizeMultiplier={1}
        error={invalid || otherProps.error}
        outlineStyle={{ borderRadius: roundness * 4 }}
        activeOutlineColor={colors.primary}
        outlineColor={colors.outline || "#FFA500"}
        placeholderTextColor={colors.outline || "#AAAAAA"}
        style={[
          { backgroundColor: colors.background }, 
          style, 
        ]}
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

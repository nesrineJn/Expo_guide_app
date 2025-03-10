import React from 'react';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';


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
        activeOutlineColor={"#FFA500"} // Couleur orange si `colors.primary` est indisponible
        outlineColor={colors.backdrop || "#FFA500"}
        placeholderTextColor={colors.outlineVariant || "#AAAAAA"}
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




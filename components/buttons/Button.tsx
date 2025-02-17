import React from 'react';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { ButtonProps as RNPButtonProps } from 'react-native-paper';


export interface ButtonProps extends RNPButtonProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary';
}
export const Button = React.forwardRef((props: ButtonProps, ref: any) => {
  const {
    loading,
    disabled,
    mode = 'contained',
    style,
    size = 'medium',
    color = 'primary',
    labelStyle,
    ...otherProps
  } = props;
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  return (
    <PaperButton
      ref={ref}
      // ref
      mode={mode}
      loading={loading}
      disabled={isDisabled}
      uppercase={false}
      labelStyle={[
        tw.style(
          'px-4',
          size === 'large' && 'py-1',
          // outlined
          mode === 'outlined' && !isDisabled && { color: colors.onPrimaryContainer },
          // text
          mode === 'text' && !isDisabled && { color: colors.onPrimaryContainer },
        ),
        {
          fontSize: scale(size === 'large' ? 15 : 14) / 1.2,
        },
        labelStyle,
      ]}
      style={[style]}
      {...otherProps}
    >
      {props.children}
    </PaperButton>
  );
});

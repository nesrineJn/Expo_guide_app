import React from 'react';
import Typography from '.';
import { TextPropsType } from './index';
import { useTheme } from '../../hooks/useTheme';
import { TouchableRipple } from 'react-native-paper';
interface LinkProps extends TextPropsType {
  onPress?: () => void;
}
const Link = ({ onPress, style, ...props }: LinkProps) => {
  const { colors } = useTheme();
  return (
    <TouchableRipple onPress={onPress} borderless>
      <Typography.Paragraph
        style={[
          {
            textDecorationLine: 'underline',
            color: colors.secondary,
          },
          style,
        ]}
        {...props}
      />
    </TouchableRipple>
  );
};

export default Link;

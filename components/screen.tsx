import { useIsFocused } from '@react-navigation/core';
import React from 'react';
import { KeyboardAvoidingView, StatusBar, StatusBarProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useThemeColors } from '../hooks/useTheme';

const style = { flex: 1 };

interface screenProps {
  children: any;
  edges?: Edge[];
  color?: string;
  /**
   * If you have a screen with Inputs Please make sure to set it to true
   */
  isKeyboardAvoidingViewEnabled?: boolean;
  statusBarProps?: StatusBarProps;
}

export default function Screen({
  color,
  isKeyboardAvoidingViewEnabled = false,
  statusBarProps = {},
  ...props
}: screenProps) {
  const isFocused = useIsFocused();
  const { dark } = useTheme();
  const colors = useThemeColors();

  return (
    <SafeAreaView edges={props?.edges} style={style}>
      {isFocused ? (
        <StatusBar
          animated={false}
          barStyle={dark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
          {...statusBarProps}
        />
      ) : null}
      {isKeyboardAvoidingViewEnabled ? (
        <KeyboardAvoidingView style={style} behavior="padding">
          {props.children}
        </KeyboardAvoidingView>
      ) : (
        props.children
      )}
    </SafeAreaView>
  );
}

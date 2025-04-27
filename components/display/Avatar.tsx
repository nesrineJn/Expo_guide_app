import React from "react";
import { View, StyleSheet } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { scale } from "react-native-size-matters";

type AvatarProps = {
  size?: number;
  src?: string;
  name?: string;
  user?: Partial<any>;
  bgColor?: string;
  borderColor?: string; 
  borderWidth?: number;
  [x: string]: any;
};

const Avatar = ({
  size = 35,
  src,
  name,
  user,
  bgColor,
  borderColor = "#e5e7eb", // couleur par défaut
  borderWidth = 2,         // largeur de la bordure par défaut
  ...rest
}: AvatarProps) => {
  const finalName = user?.fullName ?? name;
  const source = user?.profileImage || src || undefined;
  const bgColors = bgColor ? [bgColor] : undefined;

  return (
    <View
      style={[
        styles.avatarWrapper,
        {
          width: scale(size) + borderWidth * 2,
          height: scale(size) + borderWidth * 2,
          borderRadius: (scale(size) + borderWidth * 2) / 2,
          borderColor,
          borderWidth,
        },
      ]}
    >
      <UserAvatar
        style={{ borderRadius: scale(size) / 2 }}
        src={source}
        size={scale(size)}
        name={finalName}
        bgColors={bgColors}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Avatar;

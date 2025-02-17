import React from "react";

import UserAvatar from "react-native-user-avatar";

import { scale } from "react-native-size-matters";

type AvatarProps = {
  size?: number;
  src?: string;
  name?: string;
  user?: Partial<any>;
  bgColor?: string;
  [x: string]: any;
};
const Avatar = ({
  size = 35,
  src,
  name,
  user,
  bgColor,
  ...rest
}: AvatarProps) => {
  const finalName = user.fullName;
  const source = user?.avatar || src || undefined;
  const bgColors = bgColor ? [bgColor] : undefined;
  return (
    <UserAvatar
      style={{ borderRadius: scale(size) / 2 }}
      src={source}
      size={scale(size)}
      name={finalName}
      bgColors={bgColors}
      {...rest}
    />
  );
};

export default Avatar;

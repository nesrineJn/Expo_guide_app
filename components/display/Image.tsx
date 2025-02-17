import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';
interface ImageProps extends RNImageProps {}
const Image = (props: ImageProps) => {
  return <RNImage {...props} />;
};

export default Image;

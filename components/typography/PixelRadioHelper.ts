import { PixelRatio } from 'react-native';

/**
 * Returns the device pixel density. Some examples:
       PixelRatio.get() === 1
       mdpi Android devices
       PixelRatio.get() === 1.5
       hdpi Android devices
       PixelRatio.get() === 2
       iPhone SE, 6S, 7, 8
       iPhone XR
       iPhone 11
       xhdpi Android devices
       PixelRatio.get() === 3
       iPhone 6S Plus, 7 Plus, 8 Plus
       iPhone X, XS, XS Max
       iPhone 11 Pro, 11 Pro Max
       Pixel, Pixel 2
       xxhdpi Android devices
       PixelRatio.get() === 3.5
       Nexus 6
       Pixel XL, Pixel 2 XL
       xxxhdpi Android devices
 */

type DPIType = 1 | 1.5 | 2 | 3 | 3.5;

export const DPI: DPIType = PixelRatio.get() as DPIType;

export const fontScale = PixelRatio.getFontScale();

export const getPixelSizeForLayoutSize = (layoutSize: number) =>
  PixelRatio.getPixelSizeForLayoutSize(layoutSize);

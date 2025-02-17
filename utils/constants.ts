import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { userHelper } from '.';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export const APP_VERSION = DeviceInfo.getVersion();
export const APP_BUNDLE_ID = DeviceInfo.getBundleId();

export let USER_AGENT: undefined | string = undefined;

DeviceInfo.getUserAgent().then((value) => {
  USER_AGENT = value;
});

type AppConfig = {
  SOCKET_URL: string;
  API_URL: string;
  monitoring: {
    API_URL: string;
    API_KEY: string;
  };
  IDP: {
    IPD_URL: string;
    clientId: string;
  };
};
const monitoringConfig: AppConfig['monitoring'] = {
  API_URL: '',
  API_KEY: 'c301d399-af06-44c4-bf1b-f74580148409',
};
const DEV_CONFIG: AppConfig = {
  API_URL: 'http://192.168.1.13:3000',
  SOCKET_URL: 'http://192.168.100.4:3005',
  IDP: {
    IPD_URL: 'https://www.dev-idp.gofield.tech',
    // IPD_URL: 'http://192.168.100.4:3008',
    clientId: 'spotly-mobile-app',
  },
  monitoring: monitoringConfig,
};

const PROD_CONFIG: AppConfig = {
  API_URL: 'https://www.app.spotly.tn/api',
  SOCKET_URL: 'https://www.app.spotly.tn',
  // API_URL: 'https://www.dev.spotly.tn/api',
  // SOCKET_URL: 'https://www.dev.spotly.tn',
  IDP: {
    IPD_URL: 'https://www.idp.gofield.tech',
    clientId: 'spotly-mobile-app',
  },
  monitoring: monitoringConfig,
};

export const APP_CONFIG = __DEV__ ? DEV_CONFIG : PROD_CONFIG;

export const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

/**
 *
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 *
 */

export const SIZES = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const DEFAULT_NAVIGATION_OPTIONS: NativeStackNavigationOptions &
  StackNavigationOptions &
  // DrawerNavigationOptions &
  BottomTabNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  // animationEnabled: false,
};

export const generateImageName = (user: any) => {
  const timestamp = new Date().getTime();
  return `CAMERA_${userHelper
    .getUserFullName(user)
    .replace(/ /g, '_')}_${timestamp.toString()}.jpeg`;
};
export const WEEK_DAYS_VALUES = [
  { value: 'Dim.', selected: true },
  { value: 'Lun.', selected: true },
  { value: 'Mar.', selected: true },
  { value: 'Mer.', selected: true },
  { value: 'Jeu.', selected: true },
  { value: 'Ven.', selected: true },
  { value: 'Sam.', selected: true },
];

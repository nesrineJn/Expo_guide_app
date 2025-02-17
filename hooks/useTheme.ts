import { useTheme as usePaperTheme } from 'react-native-paper';
import lightTheme from "../themeProvider/light-theme.json";

type ColorsType = typeof lightTheme;
export const useThemeColors = () => usePaperTheme().colors as ColorsType;

export const useTheme = () => {
  const result = usePaperTheme();
  return {
    ...result,
    colors: result.colors as ColorsType,
  };
};

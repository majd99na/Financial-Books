import { Switch, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";

const ThemedSwitch = ({ ...props }) => {
  const scheme = useColorScheme();
  const { dark } = useUserPreferencesContext();
  //   const theme = Colors[scheme] ?? Colors.light;
  const theme = dark ? Colors.dark : Colors.light;
  return (
    <Switch
      trackColor={{ true: theme.uiActiveColor, false: theme.uiInactiveColor }}
      thumbColor={theme.uiColor}
      {...props}
    />
  );
};

export default ThemedSwitch;

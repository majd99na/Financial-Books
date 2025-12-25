import { View } from "react-native";
import { Colors } from "../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";

const ThemedView = ({ style, safe = false, ...props }) => {
  const { dark } = useUserPreferencesContext();

  const theme = dark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return safe ? (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.background,
        },
        style,
      ]}
      {...props}
    />
  ) : (
    <View
      style={[
        {
          backgroundColor: theme.background,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;

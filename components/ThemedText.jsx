import { Text } from "react-native";
import { Colors } from "../constants/Colors";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";

const ThemedText = ({ style, title = false, ...props }) => {
  //   const scheme = useColorScheme();
  //   const theme = Colors[scheme] ?? Colors.light;
  const { dark } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  return (
    <Text
      style={[
        { color: theme.textColor, fontWeight: title ? "bold" : "" },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;

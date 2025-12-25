import { TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "../constants/Colors";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";

export const ThemedButton = ({ children, style, ...props }) => {
  const { dark } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.uiActiveColor,
          padding: 10,
          margin: 10,
          borderRadius: 5,
        },
        style,
      ]}
      {...props}
    >
      <ThemedText style={{ color: "white" }}>{children}</ThemedText>
    </TouchableOpacity>
  );
};

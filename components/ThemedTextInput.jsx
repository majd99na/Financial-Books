import { TextInput } from "react-native";
import { Colors } from "../constants/Colors";
import Color from "color";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
const ThemedTextInput = ({ error = false, style, number, ...props }) => {
  const { dark } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  const placeholderColor = Color(theme.textColor).alpha("0.4").rgb().string();
  return (
    <TextInput
      keyboardType={number ? "number-pad" : "default"}
      style={[
        {
          color: theme.textColor,
          borderColor: error ? "red" : theme.uiInactiveColor,
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 5,
          width: "80%",
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
};

export default ThemedTextInput;

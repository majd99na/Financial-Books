import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "./ThemedText";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { Colors } from "../constants/Colors";
const CustomCheckBox = ({ checked = false, ...props }) => {
  const { dark } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  return (
    <View
      {...props}
      style={{
        // position: "absolute",
        minWidth: 20,
        minHeight: 20,
        borderColor: theme.textColor,
        borderWidth: 1,
        borderRadius: 5,
        // top: "-50%",
        insetInlineStart: "-10",
      }}
    >
      {checked ? (
        <Ionicons name="checkmark" color={theme.textColor} size={20} />
      ) : (
        <View {...props} style={{ minWidth: 20, minHeight: 20 }} />
      )}
    </View>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({});

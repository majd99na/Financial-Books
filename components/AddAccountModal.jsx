import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import ThemedTextInput from "./ThemedTextInput";
import { ThemedButton } from "./ThemedButton";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { Colors } from "../constants/Colors";
import { useRecordsContext } from "../contexts/RecordsContext";
import { Dropdown } from "react-native-element-dropdown";
import { Picker } from "@react-native-picker/picker";

const AddAccountModal = ({ openModal, setOpenModal, ...props }) => {
  const { dark, language } = useUserPreferencesContext();
  const currencies = ["USD", "SYP"];
  const [accountTitle, setAccountTitle] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");
  const { createAccount } = useRecordsContext();
  const theme = dark ? Colors.dark : Colors.light;
  const handleAddAccount = async () => {
    setError("");
    if (!accountTitle) {
      setError("Account title can't be empty");
      return;
    }
    if (!currency) {
      setError("Currency can't be empty");
      return;
    }
    await createAccount(accountTitle, currency);
    setAccountTitle("");
    setCurrency("");
    setOpenModal(false);
  };
  return (
    <Modal visible={openModal} transparent animationType="fade">
      <TouchableWithoutFeedback
        {...props}
        onPress={() => {
          setError("");
          setOpenModal(false);
        }}
      >
        <ThemedView style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView
              onStartShouldSetResponder={() => true}
              style={{
                height: "30%",
                width: "60%",
                alignItems: "center",
                justifyContent: "center",
                borderColor: theme.textColor,
                borderWidth: 1,
                borderRadius: 10,
                paddingTop: 30,
              }}
            >
              <ThemedText
                title
                style={{
                  padding: 10,
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform:
                    language == "en" ? "translateX(-50%)" : "translateX(50%)",
                }}
              >
                {language == "en" ? "New Account" : "حساب جديد"}
              </ThemedText>
              <ThemedTextInput
                error={error.toLowerCase().includes("title")}
                value={accountTitle}
                onChangeText={setAccountTitle}
                placeholder={language == "en" ? "Account name" : "اسم الحساب"}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ThemedText>
                  {language == "en" ? "Currency: " : "العملة: "}
                </ThemedText>
                <Picker
                  style={{ width: "60%", color: theme.textColor }}
                  dropdownIconColor={theme.textColor}
                  dropdownIconRippleColor={"purple"}
                  onValueChange={setCurrency}
                  selectedValue={currency}
                  placeholder="Select a currency"
                >
                  {currencies.map((currency) => (
                    <Picker.Item
                      key={currency}
                      label={currency}
                      value={currency}
                    />
                  ))}
                </Picker>
              </View>
              <ThemedButton
                style={{ width: "60%", alignItems: "center" }}
                onPress={handleAddAccount}
              >
                {language == "en" ? "Add new account" : "إضافة"}
              </ThemedButton>
              {error && (
                <ThemedText style={{ color: "red" }}>{error}</ThemedText>
              )}
            </ThemedView>
          </TouchableWithoutFeedback>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddAccountModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});

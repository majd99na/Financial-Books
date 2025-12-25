import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useState } from "react";
import { ThemedButton } from "../../components/ThemedButton";
import { useRecordsContext } from "../../contexts/RecordsContext";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useUserPreferencesContext } from "../../contexts/UserPreferencesContext";
import { Colors } from "../../constants/Colors";
import AddAccountModal from "../../components/AddAccountModal";
const accounts = () => {
  const [openModal, setOpenModal] = useState(false);

  const { accounts, deleteAccount } = useRecordsContext();

  const {
    defaultAccount,
    setDefaultAccount,
    addPreference,
    deletePreference,
    dark,
    language,
  } = useUserPreferencesContext();

  const theme = dark ? Colors.dark : Colors.light;
  return (
    <ThemedView safe style={styles.container}>
      {accounts.length > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ThemedText>
            {language == "en" ? "Select default account" : "الحساب الافتراضي"}
          </ThemedText>

          <Dropdown
            style={{
              width: "50%",
              backgroundColor: "rgba(0,0,0,0.05)",
              padding: 10,
              borderRadius: 10,
            }}
            data={accounts}
            labelField="title"
            valueField="title"
            placeholder={language == "en" ? "Select an account" : "اختار حساب"}
            selectedTextStyle={{ color: theme.textColor }}
            placeholderStyle={{ color: theme.textColor }}
            value={
              accounts.find((account) => account.id == defaultAccount)?.title
            }
            onChange={({ id }) => {
              setDefaultAccount(id);
              deletePreference("account");
              addPreference("account", id);
            }}
            renderItem={(item) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <ThemedText style={{ color: "black" }}>{item.title}</ThemedText>
                <Ionicons
                  onPress={(e) => {
                    e.stopPropagation();
                    deleteAccount(item.id);
                    deletePreference("account");
                  }}
                  name="trash"
                  color="red"
                  size={20}
                />
              </View>
            )}
          />
        </View>
      )}
      <ThemedButton
        style={{ alignSelf: "left", width: "50%" }}
        onPress={() => setOpenModal(true)}
      >
        {language == "en" ? "Add an account" : "إضافة حساب"}
      </ThemedButton>
      <AddAccountModal openModal={openModal} setOpenModal={setOpenModal} />
    </ThemedView>
  );
};

export default accounts;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
});

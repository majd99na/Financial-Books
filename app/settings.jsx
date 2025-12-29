import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedSwitch from "../components/ThemedSwitch";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { ThemedButton } from "../components/ThemedButton";
import { useRecordsContext } from "../contexts/RecordsContext";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../constants/Colors";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import ThemedTextInput from "../components/ThemedTextInput";
const settings = () => {
  const {
    addPreference,
    deletePreference,
    dark,
    setDark,
    language,
    setLanguage,
    preferedLocale,
    setPreferedLocale,
    numberFormat,
    setNumberFormat,
  } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  const { exportData, importData, manualExport } = useRecordsContext();
  const [message, setMessage] = useState({ success: undefined, message: "" });
  const [openModal, setOpenModal] = useState({
    open: false,
    data: "",
    type: "",
  });
  const [insertedData, setInsertedData] = useState("");
  return (
    <ThemedView style={[styles.container, { gap: 10 }]} safe>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <ThemedText title>
          {language == "en" ? "Dark Mode:" : "الوضع الداكن:"}
        </ThemedText>
        <ThemedSwitch
          onValueChange={() => {
            deletePreference("dark");
            addPreference("dark", dark ? "false" : "true");
            setDark((prev) => !prev);
          }}
          value={dark}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ThemedText>English</ThemedText>
        <ThemedSwitch
          value={language == "ar"}
          onValueChange={() => {
            deletePreference("language");
            addPreference("language", language == "ar" ? "en" : "ar");
            setLanguage(language == "ar" ? "en" : "ar");
          }}
        />
        <ThemedText>العربية</ThemedText>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ThemedText title>
          {language == "en" ? "Locale:" : "طريقة عرض التاريخ:"}
        </ThemedText>
        <Dropdown
          style={{
            padding: 10,
            width: "50%",
            alignSelf: "center",
            backgroundColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderRadius: 10,
          }}
          placeholderStyle={{ color: dark ? "white" : "black" }}
          selectedTextStyle={{ color: dark ? "white" : "black" }}
          placeholder={
            language == "en" ? "Select locale" : "اختار طريقة عرض التاريخ"
          }
          data={[
            { label: "en-US", value: "en-US" },
            { label: "العربية سوريا", value: "ar-SY" },
            { label: "العربية مصر", value: "ar-EG" },
          ]}
          labelField={"label"}
          valueField={"value"}
          value={preferedLocale}
          onChange={(item) => {
            deletePreference("locale");
            addPreference("locale", item.value);
            setPreferedLocale(item.value);
          }}
          renderItem={(item) => (
            <ThemedText style={{ padding: 10, color: "black" }}>
              {item.label}
            </ThemedText>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ThemedText title>
          {language == "en" ? "Numbers:" : "طريقة عرض الارقام:"}
        </ThemedText>
        <Dropdown
          style={{
            padding: 10,
            width: "50%",
            alignSelf: "center",
            backgroundColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderRadius: 10,
          }}
          placeholderStyle={{ color: dark ? "white" : "black" }}
          selectedTextStyle={{ color: dark ? "white" : "black" }}
          placeholder={
            language == "en"
              ? "Select number format"
              : "اختار طريقة عرض الارقام"
          }
          data={[
            {
              label: language == "en" ? "English Numbers" : "أرقام انجليزية",
              value: "en-US",
            },
            {
              label: language == "en" ? "Arabic Numbers" : "أرقام عربية",
              value: "ar-SY",
            },
          ]}
          labelField={"label"}
          valueField={"value"}
          value={numberFormat}
          onChange={(item) => {
            deletePreference("numberFormat");
            addPreference("numberFormat", item.value);
            setNumberFormat(item.value);
          }}
          renderItem={(item) => (
            <ThemedText style={{ padding: 10, color: "black" }}>
              {item.label}
            </ThemedText>
          )}
        />
      </View>
      <View>
        <ThemedText
          title
          style={{
            fontSize: 20,
            borderBottomColor: theme.textColor,
            borderBottomWidth: 1,
          }}
        >
          {language == "en"
            ? "Automatic Data Backup"
            : "نسخ احتياطي اوتوماتيكي"}
        </ThemedText>
        <ThemedButton
          onPress={() => {
            setMessage({ success: undefined, message: "" });
            exportData()
              .then((e) => setMessage({ success: true, message: e }))
              .catch((e) => setMessage({ success: false, message: e }));
          }}
        >
          {language == "en"
            ? "Export Data to a file"
            : "إنشاء نسخة احتياطية إلى ملف"}
        </ThemedButton>
        <ThemedButton
          onPress={() => {
            setMessage({ success: undefined, message: "" });
            importData()
              .then((e) => setMessage({ success: true, message: e }))
              .catch((e) => setMessage({ success: false, message: e }));
          }}
        >
          {language == "en"
            ? "Import Data from a file"
            : "استعادة النسخة الاحتياطية من ملف"}
        </ThemedButton>
        {message.message && (
          <ThemedText
            title
            style={{ color: !message.success ? "red" : "green" }}
          >
            {message.message}
          </ThemedText>
        )}
      </View>
      <View>
        <ThemedText
          title
          style={{
            fontSize: 20,
            borderBottomColor: theme.textColor,
            borderBottomWidth: 1,
          }}
        >
          {language == "en" ? "Manual Data Backup" : "نسخ احتياطي يدوي"}
        </ThemedText>
        <ThemedText style={{ color: "red" }}>
          {language == "en"
            ? "*If you have a problem saving the file you can copy the data manullay and save them in a file for a later import."
            : "اذا واجهت مشكلة في استخدام النسخة الاحتياطية الآلية في الاعلى, يمكنك نسخ البيانات يدوياً و حفظهم في ملف لاستعاداته لاحقاً."}
        </ThemedText>
        <ThemedText
          onPress={() => {
            setOpenModal({ open: true, type: "info" });
          }}
          title
        >
          {language == "en"
            ? "More Info About Manual Data Export"
            : "مزيد من المعلومات حول النسخ الاحتياطي اليدوي"}
        </ThemedText>
        <ThemedButton
          onPress={async () => {
            const data = await manualExport();
            setOpenModal({ open: true, data: data, type: "export" });
          }}
        >
          {language == "en" ? "Export Data Manually" : "نسخة احتياطية يدوية"}
        </ThemedButton>
        <ThemedButton
          onPress={async () => {
            setOpenModal({ open: true, type: "import" });
          }}
        >
          {language == "en"
            ? "Import Data Manually"
            : "استعادة النسخة الاحتياطية يدوياً"}
        </ThemedButton>
      </View>
      <Modal
        visible={openModal.open && openModal.type == "export"}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenModal({ open: false, type: "" });
          }}
        >
          <ThemedView style={[styles.modalContainer]}>
            <ThemedView
              style={{
                borderColor: theme.textColor,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                height: "30%",
                width: "60%",
              }}
              onStartShouldSetResponder={() => true}
            >
              <ThemedText
                style={{
                  color: theme.textColor,
                  borderColor: theme.textColor,
                  borderWidth: 1,
                  padding: 5,
                  height: "70%",
                  // width: "80%",
                }}
                selectable
              >
                {openModal.data}
              </ThemedText>
              <ThemedButton
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(openModal.data);
                    ToastAndroid.show("Copied sucessfully", ToastAndroid.SHORT);
                  } catch (error) {
                    console.log(error);

                    ToastAndroid.show("Couldn't copy", ToastAndroid.SHORT);
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Ionicons name="copy" color={"white"} size={20} />
                  <ThemedText>Copy to clipboard</ThemedText>
                </View>
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={openModal.open && openModal.type == "info"}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenModal({ open: false, type: "" });
          }}
        >
          <ThemedView style={styles.modalContainer}>
            <ThemedView
              style={{
                width: "50%",
                height: "30%",
                padding: 20,
                borderColor: theme.textColor,
                borderWidth: 1,
                borderRadius: 10,
              }}
              onStartShouldSetResponder={() => true}
            >
              <ScrollView>
                <ThemedText title style={{ textAlign: "center" }}>
                  {language == "en"
                    ? "Manual export instructions"
                    : "تعليمات النسخ الاحتياطي اليدوي"}
                </ThemedText>
                <ThemedText>
                  {language == "en"
                    ? `Option one:\n1. Copy the text provided.\n2. Keep it somewhere safe.\n3. Paste it in when you want to recover your data.
                  \nOption two:\n 1. Copy the text provided.\n2. Create a file with 'json' or 'txt' format and paste the content provided there.\n3. Keep the file you created safe.\n4. Use the automatic import data option to retrieve the data from a file.`
                    : `الطريقة الاولى:\n1- انسخ المحتوى.\n2- احفظه في مكان آمن.\n3- الصق المحتوى في عندما تريد استعادة البيانات.\n\nالطريقة الثانية:\n1-انسخ المحتوى.\n2-أنشئ ملف بصيغة "json" او "txt" و الصق المحتوى.\n3-احفظ الملف و اختاره عندما تريد استعادة بياناتك.`}
                </ThemedText>
              </ScrollView>
            </ThemedView>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={openModal.open && openModal.type == "import"}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenModal({ open: false, type: "" });
          }}
        >
          <ThemedView style={styles.modalContainer}>
            <ThemedView
              style={{
                width: "50%",
                height: "20%",
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                borderColor: theme.textColor,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <ThemedTextInput
                style={{ maxHeight: "40%" }}
                multiline
                placeholder={
                  language == "en"
                    ? "Paste in the data..."
                    : "الصق البيانات هنا..."
                }
                value={insertedData}
                onChangeText={setInsertedData}
              />
              <ThemedButton
                onPress={async () => {
                  await importData(true, insertedData);
                  setOpenModal({ open: false, type: "" });
                }}
              >
                {language == "en" ? "Import data" : "استعادة البيانات"}
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});

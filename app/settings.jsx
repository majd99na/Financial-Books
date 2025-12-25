import { StyleSheet, View } from "react-native";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedSwitch from "../components/ThemedSwitch";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { ThemedButton } from "../components/ThemedButton";
import { useRecordsContext } from "../contexts/RecordsContext";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { reloadAppAsync } from "expo";

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
  const { exportData, importData } = useRecordsContext();
  const [message, setMessage] = useState({ success: undefined, message: "" });
  return (
    <ThemedView style={[styles.container, { gap: 10 }]} safe>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <ThemedText title>
          {language == "en" ? "Dark Mode:" : "الوضع الداكن:"}
        </ThemedText>
        <ThemedSwitch
          onValueChange={() => {
            deletePreference("dark");
            addPreference("dark", !dark);
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
        <ThemedButton
          onPress={() => {
            setMessage({ success: undefined, message: "" });
            exportData()
              .then((e) => setMessage({ success: true, message: e }))
              .catch((e) => setMessage({ success: false, message: e }));
          }}
        >
          {language == "en" ? "Export Data" : "إنشاء نسخة احتياطية"}
        </ThemedButton>
        <ThemedButton
          onPress={() => {
            setMessage({ success: undefined, message: "" });
            importData()
              .then((e) => setMessage({ success: true, message: e }))
              .catch((e) => setMessage({ success: false, message: e }));
          }}
        >
          {language == "en" ? "Import Data" : "استعادة النسخة الاحتياطية"}
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
    </ThemedView>
  );
};

export default settings;

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });

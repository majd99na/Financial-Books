import {
  ActivityIndicator,
  I18nManager,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useRecordsContext } from "../../contexts/RecordsContext";
import ThemedList from "../../components/ThemedList";
import { useUserPreferencesContext } from "../../contexts/UserPreferencesContext";
import { Dropdown } from "react-native-element-dropdown";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useRef, useState } from "react";
import AddAccountModal from "../../components/AddAccountModal";
import { ThemedButton } from "../../components/ThemedButton";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useNavigation, useRouter } from "expo-router";
import { addEventListener } from "expo-linking";
import { v4 } from "uuid";

const Records = () => {
  const {
    records,
    accounts,
    selectedAccount,
    setSelectedAccount,
    calculateTotals,
    calculateYearTotals,
    pending,
  } = useRecordsContext();

  const { language, dark, loading, preferedLocale } =
    useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  const [openModal, setOpenModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchWord, setSearchWord] = useState("");
  const years = useMemo(() => {
    const start = 1990,
      end = new Date().getFullYear();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  const Totals = useMemo(
    () => calculateTotals(month, year, selectedAccount),
    [month, year, records, selectedAccount]
  );
  const YearTotals = useMemo(
    () => calculateYearTotals(year, selectedAccount),
    [year, records, selectedAccount]
  );
  const filteredData = useMemo(() => {
    if (!searchWord) return records;
    return records.filter((record) =>
      record.title.toLowerCase().includes(searchWord.toLowerCase())
    );
  }, [records, searchWord]);
  const getMonthNames = (
    locale = preferedLocale || (language == "en" ? "default" : "ar-SY"),
    format = "long"
  ) => {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: format,
      timeZone: "UTC",
    });
    return Array.from({ length: 12 }, (_, i) =>
      formatter.format(new Date(Date.UTC(2020, i, 1)))
    );
  };

  if (pending)
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator color={"red"} size={40} />
      </ThemedView>
    );
  // if (loading) return;
  if (accounts.length == 0)
    return (
      <ThemedView safe style={{ flex: 1 }}>
        <ThemedText title>
          {language == "en"
            ? "You have no accounts, please create an account first."
            : "ليس لديك أية حسابات بعد, أضف حساباً."}
        </ThemedText>
        <ThemedButton
          style={{ alignSelf: "left", width: "50%" }}
          onPress={() => setOpenModal(true)}
        >
          {language == "en" ? "Add an account" : "إضافة حساب"}
        </ThemedButton>
        <AddAccountModal openModal={openModal} setOpenModal={setOpenModal} />
      </ThemedView>
    );
  return (
    <ThemedView safe style={styles.container}>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            padding: 10,
          }}
        >
          <ThemedText>{language == "en" ? "Account:" : "الحساب:"}</ThemedText>
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
            placeholder="Select an account"
            data={accounts}
            labelField={"title"}
            valueField={"title"}
            value={
              accounts.find((account) => account.id == selectedAccount)?.title
            }
            onChange={(item) => setSelectedAccount(item.id)}
            renderItem={(item) => (
              <ThemedText style={{ padding: 10, color: "black" }}>
                {item.title}
              </ThemedText>
            )}
          />
        </View>
        {records.length > 0 && (
          <View
            style={{
              flexDirection: "column",
              borderColor: dark ? "white" : "black",
              borderWidth: 0.5,
              width: "90%",
              borderRadius: 5,
              // padding: 5,
              margin: 10,
              // paddingTop: 40,
              alignSelf: "center",
            }}
          >
            <ThemedText
              title
              style={{
                // position: "absolute",
                // top: 0,
                // left: I18nManager.isRTL ? "" : "50%",
                // right: I18nManager.isRTL ? "50%" : "",
                // transform: I18nManager.isRTL
                // ? "translateX(-50%)"
                // : "translateX(-50%)",
                width: "80%",
                alignSelf: "center",
                textAlign: "center",
                borderBottomColor: theme.textColor,
                borderRightColor: theme.textColor,
                borderLeftColor: theme.textColor,
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
                borderBottomWidth: 0.5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                padding: 10,
              }}
            >
              {language == "en" ? "Summary" : "الملخص"}
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  width: "20%",
                  alignItems: "flex-start",
                }}
              >
                <ThemedText title>
                  {language == "en" ? "Period:" : "الوقت:"}
                </ThemedText>
              </View>
              <Picker
                style={{
                  width: "40%",
                  color: theme.textColor,
                }}
                dropdownIconColor={theme.textColor}
                dropdownIconRippleColor={"purple"}
                selectedValue={month}
                onValueChange={setMonth}
                mode="dropdown"
              >
                {getMonthNames().map((m, i) => (
                  <Picker.Item key={i} label={m} value={i} />
                ))}
              </Picker>
              <Picker
                selectedValue={year}
                style={{ width: "40%", color: theme.textColor }}
                dropdownIconColor={theme.textColor}
                dropdownIconRippleColor={"purple"}
                onValueChange={setYear}
                mode="dropdown"
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={String(y)} value={y} />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: theme.textColor,
                borderBottomWidth: 1,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <ThemedText title>
                    {language == "en" ? "Income:" : "الدخل:"}
                  </ThemedText>
                  <ThemedText>
                    {Intl.NumberFormat("en-US").format(Totals?.["income"])}
                  </ThemedText>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <ThemedText title>
                    {language == "en" ? "Expenses:" : "الصرف:"}
                  </ThemedText>
                  <ThemedText>
                    {Intl.NumberFormat("en-US").format(
                      Totals?.["expenses"] * -1
                    )}
                  </ThemedText>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <ThemedText title>
                  {language == "en" ? "Total:" : "المجموع:"}
                </ThemedText>
                {Totals?.["income"] + Totals?.["expenses"] > 0 ? (
                  <Ionicons name="arrow-up" size={10} color="green" />
                ) : (
                  <Ionicons name="arrow-down" size={10} color="red" />
                )}
                <ThemedText>
                  {Intl.NumberFormat("en-US").format(
                    Totals?.["income"] + Totals?.["expenses"]
                  )}
                </ThemedText>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <View>
                <ThemedText>
                  {language == "en" ? "Year" : "سنة"} {year} :
                </ThemedText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View>
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <ThemedText title>
                      {language == "en" ? "Income:" : "الدخل:"}
                    </ThemedText>
                    <ThemedText>
                      {Intl.NumberFormat("en-US").format(
                        YearTotals?.["income"]
                      )}
                    </ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <ThemedText title>
                      {language == "en" ? "Expenses::" : "الصرف:"}
                    </ThemedText>
                    <ThemedText>
                      {Intl.NumberFormat("en-US").format(
                        YearTotals?.["expenses"] * -1
                      )}
                    </ThemedText>
                  </View>
                </View>

                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <ThemedText title>
                    {language == "en" ? "Total:" : "المجموع:"}
                  </ThemedText>
                  {YearTotals?.["income"] + YearTotals?.["expenses"] > 0 ? (
                    <Ionicons name="arrow-up" size={10} color="green" />
                  ) : (
                    <Ionicons name="arrow-down" size={10} color="red" />
                  )}
                  <ThemedText>
                    {Intl.NumberFormat("en-US").format(
                      YearTotals?.["income"] + YearTotals?.["expenses"]
                    )}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}

        {records.length > 0 && (
          <ThemedTextInput
            style={{ alignSelf: "center" }}
            onChangeText={setSearchWord}
            placeholder={language == "en" ? "Search..." : "بحث..."}
          />
        )}
        {pending ? (
          <ActivityIndicator color={dark ? "lightblue" : "blue"} />
        ) : (
          selectedAccount && (
            <ThemedList search={searchWord.length > 0} data={filteredData} />
          )
        )}
      </ScrollView>
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default Records;

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ThemedView from "../../components/ThemedView";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useUserPreferencesContext } from "../../contexts/UserPreferencesContext";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../../constants/Colors";
import ThemedText from "../../components/ThemedText";
import { ThemedButton } from "../../components/ThemedButton";
import { useRecordsContext } from "../../contexts/RecordsContext";
import ThemedList from "../../components/ThemedList";
import { Dropdown } from "react-native-element-dropdown";

const search = () => {
  const { language, dark, numberFormat, preferedLocale } =
    useUserPreferencesContext();
  const {
    records,
    selectedAccount,
    setSelectedAccount,
    accounts,
    search,
    pending,
  } = useRecordsContext();
  const theme = dark ? Colors.dark : Colors.light;
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [total, setTotal] = useState(0);
  const [list, setList] = useState({ key: "", list: [] });
  const [currentItem, setCurrentItem] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [show, setShow] = useState(false);

  const years = useMemo(() => {
    const start = 1990,
      end = new Date().getFullYear();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);
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
  useEffect(() => {
    if (isFirst) return;
    (async () => {
      const res = await search(list.key, month, year, selectedAccount);
      setList({ key: list.key, list: res.list });
    })();
  }, [records]);
  const handleSubmit = async () => {
    if (!searchTerm)
      return ToastAndroid.show(
        language == "en"
          ? "Search word can't be empty"
          : "لا يمكن أن تكون كلمة البحث فارغة",
        ToastAndroid.SHORT
      );
    // setList({ key: "", list: [] });
    try {
      const res = await search(searchTerm.trim(), month, year, selectedAccount);
      // if (res.list.length > 0) {
      setList({ key: searchTerm.trim(), list: res.list });
      setTotal(res.total);
      setCurrentItem(searchTerm);
      // }
      setSearchTerm("");
      setIsFirst(false);
      setShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (accounts.length == 0)
    return (
      <ThemedView style={styles.container}>
        <ThemedText>
          {language == "en" ? "No data yet" : "ليس هناك بيانات بعد."}
        </ThemedText>
      </ThemedView>
    );
  return (
    <ThemedView safe style={styles.container}>
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
      <ThemedTextInput
        placeholder={language == "en" ? "Search for..." : "ابحث عن..."}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ThemedText title>{language == "en" ? "At:" : "في تاريخ:"}</ThemedText>
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
      <ThemedButton onPress={handleSubmit}>
        {language == "en" ? "Search" : "ابحث"}
      </ThemedButton>
      {pending ? (
        <ActivityIndicator size={20} color={dark ? "lightblue" : "blue"} />
      ) : (
        show && (
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ThemedText title>
                  {language == "en" ? "Item:" : "المادة:"}
                </ThemedText>
                <ThemedText>{currentItem}</ThemedText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ThemedText title>
                  {language == "en" ? "Total:" : "المجموع:"}
                </ThemedText>
                <ThemedText>
                  {Intl.NumberFormat(
                    numberFormat
                      ? numberFormat
                      : accounts.find(
                          (account) => account.id == selectedAccount
                        )?.currency == "SYP"
                      ? "ar-SY"
                      : "en-US",
                    {
                      style: "currency",
                      currency:
                        accounts.find(
                          (account) => account.id == selectedAccount
                        )?.currency || "SYP",
                      currencyDisplay: "symbol",
                    }
                  ).format(total < 0 ? total * -1 : total)}
                </ThemedText>
              </View>
            </View>

            <ThemedList search scroll={true} data={list.list} />
          </View>
        )
      )}
    </ThemedView>
  );
};

export default search;

const styles = StyleSheet.create({ container: { flex: 1, padding: 10 } });

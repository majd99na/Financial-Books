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
import { Ionicons } from "@expo/vector-icons";
import { v4 } from "uuid";
const search = () => {
  const { language, dark, numberFormat, preferedLocale } =
    useUserPreferencesContext();
  const {
    records,
    selectedAccount,
    setSelectedAccount,
    accounts,
    searchMonth,
    pending,
    calculateSelected,
  } = useRecordsContext();
  const theme = dark ? Colors.dark : Colors.light;
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [total, setTotal] = useState({ expenses: 0, income: 0, total: 0 });
  const [list, setList] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  useEffect(() => {
    setChecked((prev) =>
      prev.filter((item) => records.some((i) => i.id == item))
    );
  }, [records]);
  useEffect(() => {
    if (checked.length == 0) return;

    const res = calculateSelected(checked);
    setSelectedTotal(res);
  }, [checked, records]);
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
      const res = await searchMonth(month, year, selectedAccount);

      setList(res.list);
      setTotal({
        expenses: res.expenses,
        income: res.income,
        total: res.total,
      });
    })();
  }, [records]);

  const handleSubmit = async () => {
    setChecked([]);
    try {
      const res = await searchMonth(month, year, selectedAccount);
      setList(res.list);
      setTotal({
        expenses: res.expenses,
        income: res.income,
        total: res.total,
      });
      // setCurrentItem(searchTerm);
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
        <View style={styles.container}>
          {list.length > 0 && (
            <>
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
                    {language == "en" ? "Income:" : "الدخل:"}
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
                    ).format(total.income)}
                  </ThemedText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <ThemedText title>
                    {language == "en" ? "Expenses:" : "الصرف:"}
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
                    ).format(total.expenses)}
                  </ThemedText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <ThemedText title>
                    {language == "en" ? "Total:" : "المجموع:"}
                  </ThemedText>
                  {total.total < 0 ? (
                    <Ionicons name="arrow-down" color="red" />
                  ) : (
                    <Ionicons name="arrow-up" color="green" />
                  )}
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
                    ).format(total.total < 0 ? total.total * -1 : total.total)}
                  </ThemedText>
                </View>
              </View>
              {checked.length > 0 && (
                <View
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <ThemedText title>
                    {language == "en" ? "Selected Total:" : "مجموع المحدد:"}
                  </ThemedText>
                  {selectedTotal > 0 ? (
                    <Ionicons name="arrow-up" color={"green"} />
                  ) : (
                    <Ionicons name="arrow-down" color={"red"} />
                  )}
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
                    ).format(selectedTotal)}
                  </ThemedText>
                </View>
              )}
            </>
          )}

          {show && (
            <ThemedList
              checked={checked}
              setChecked={setChecked}
              check={true}
              search
              scroll={true}
              data={list}
            />
          )}
        </View>
      )}
    </ThemedView>
  );
};

export default search;

const styles = StyleSheet.create({ container: { flex: 1, padding: 10 } });

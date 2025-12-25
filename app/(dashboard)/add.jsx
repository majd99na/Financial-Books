import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { ThemedButton } from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import DatePicker from "react-native-date-picker";
import ThemedText from "../../components/ThemedText";
import { useRecordsContext } from "../../contexts/RecordsContext";
import { Dropdown } from "react-native-element-dropdown";
import { useUserPreferencesContext } from "../../contexts/UserPreferencesContext";
import { Picker } from "@react-native-picker/picker";
const add = () => {
  const { dark, language, preferedLocale } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState(language == "en" ? "expense" : "صرف");
  const [error, setError] = useState([]);

  const { addRecord, selectedAccount, setSelectedAccount, accounts } =
    useRecordsContext();
  const handleSubmit = async () => {
    setError([]);
    if (!title || price == 0) {
      if (!title)
        setError((prev) => [
          ...prev,
          language == "en"
            ? "Title can't be empty"
            : "المادة لا يمكن أن تكون بلا قيمة",
        ]);
      if (price == 0)
        setError((prev) => [
          ...prev,
          language == "en" ? "Price can't be 0" : "السعر لا يمكن أن يكون 0",
        ]);
      return;
    }
    const selectedType =
      language == "en" ? type : type == "دخل" ? "income" : "expense";

    const data = {
      title,
      price: selectedType == "expense" ? price * -1 : price,
      date: date.toISOString().split("T")[0],
      selectedAccount,
    };
    try {
      await addRecord(data);
      setTitle("");
      setPrice(0);
      // setDate(new Date());
    } catch (error) {
      console.log(error);
      setError((prev) => [...prev, error]);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        {/* <ThemedText
          title
          style={{
            borderBottomColor: theme.textColor,
            borderBottomWidth: 1,
            padding: 10,
            marginBottom: 10,
            fontSize: 20,
          }}
        >
          {language == "en" ? "New Record" : "إضافة سجل"}
        </ThemedText> */}
        <ThemedView style={{ width: "100%", alignItems: "center", gap: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText title>
              {language == "en" ? "Account: " : "الحساب: "}
            </ThemedText>

            <Dropdown
              style={{
                width: "50%",
                padding: 10,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderRadius: 10,
              }}
              placeholderStyle={{ color: dark ? "white" : "black" }}
              selectedTextStyle={{ color: dark ? "white" : "black" }}
              data={accounts}
              valueField={"title"}
              labelField={"title"}
              value={
                accounts.find((account) => account.id == selectedAccount)?.title
              }
              onChange={({ id }) => setSelectedAccount(id)}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText title>
              {language == "en" ? "Type:" : "النوع: "}
            </ThemedText>
            <Dropdown
              style={{
                width: "50%",
                padding: 10,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderRadius: 10,
              }}
              placeholderStyle={{ color: dark ? "white" : "black" }}
              selectedTextStyle={{
                color: dark ? "white" : "black",
                textTransform: "capitalize",
              }}
              data={
                language == "en"
                  ? [{ type: "income" }, { type: "expense" }]
                  : [{ type: "دخل" }, { type: "صرف" }]
              }
              valueField={"type"}
              labelField={"type"}
              value={type}
              onChange={({ type }) => setType(type)}
              itemTextStyle={{ textTransform: "capitalize" }}
            />
          </View>

          <ThemedTextInput
            error={error.some((error) => error.toLowerCase().includes("title"))}
            value={title}
            onChangeText={setTitle}
            placeholder={language == "en" ? "Title" : "المادة"}
          />
          <ThemedTextInput
            error={error.some((error) => error.toLowerCase().includes("price"))}
            number
            value={price}
            onChangeText={setPrice}
            placeholder={language == "en" ? "Price" : "السعر"}
          />
          {/* <ThemedButton onPress={() => setOpen(true)}>Open Date</ThemedButton> */}
          <DatePicker
            locale={language == "en" ? language : preferedLocale || "ar-SY"}
            // dividerColor="black"
            theme={dark ? "dark" : "light"}
            // modal
            // open={open}
            mode="date"
            date={date}
            onDateChange={setDate}
          />
          <ThemedButton
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSubmit}
          >
            {language == "en" ? "Add" : "إضافة"}
          </ThemedButton>
          {error.length > 0 && (
            <ThemedText style={{ color: "red" }}>{error.join("\n")}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default add;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
});

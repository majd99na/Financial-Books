import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { Colors } from "../constants/Colors";
import ThemedTextInput from "./ThemedTextInput";
import DatePicker from "react-native-date-picker";
import { ThemedButton } from "./ThemedButton";
import { useRecordsContext } from "../contexts/RecordsContext";

const EditModal = ({ openModal, setOpenModal, item, ...props }) => {
  const { language, dark, preferedLocale } = useUserPreferencesContext();
  const { editRecord } = useRecordsContext();
  const [error, setError] = useState("");
  const theme = dark ? Colors.dark : Colors.light;
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();
  useEffect(() => {
    setTitle(item?.title);
    setPrice(item?.price < 0 ? item?.price * -1 : item?.price);
    setDate(new Date(item?.date));
  }, [item]);
  const submitEdit = async () => {
    if (
      item.title == title &&
      item.price == (item.price < 0 ? price * -1 : price) &&
      item.date == new Date(date).toISOString().split("T")[0]
    )
      return setError(
        language == "en" ? "Nothing updated" : "ليس هناك أي تعديلات"
      );

    const data = {
      title: title,
      price: item.price < 0 ? price * -1 : price,
      date: date.toISOString().split("T")[0],
    };
    try {
      await editRecord(item.id, data);

      setOpenModal({ open: false });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal visible={openModal} transparent animationType="fade">
      <TouchableWithoutFeedback
        {...props}
        onPress={() => {
          setError("");
          setOpenModal({ open: false });
        }}
      >
        <ThemedView style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView
              onStartShouldSetResponder={() => true}
              style={{
                height: "55%",
                width: "70%",
                alignItems: "center",
                justifyContent: "center",
                borderColor: theme.textColor,
                borderWidth: 2,
                borderRadius: 10,
                paddingTop: 30,
                gap: 5,
              }}
            >
              <ThemedText
                title
                style={{
                  fontSize: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: dark ? "white" : "black",
                  marginBottom: 10,
                }}
              >
                {language == "en" ? "Edit" : "تعديل"}
              </ThemedText>
              <ThemedTextInput
                onChangeText={setTitle}
                defaultValue={item?.title}
              />
              <ThemedTextInput
                onChangeText={setPrice}
                number
                defaultValue={String(
                  item?.price < 0 ? item?.price * -1 : item?.price
                )}
              />
              <DatePicker
                locale={language == "en" ? language : preferedLocale || "ar-SY"}
                // dividerColor="black"
                theme={dark ? "dark" : "light"}
                // modal
                // open={open}
                mode="date"
                date={new Date(item?.date)}
                onDateChange={setDate}
              />
              <ThemedButton onPress={submitEdit}>
                {language == "en" ? "Edit" : "تعديل"}
              </ThemedButton>
              {error && (
                <ThemedText title style={{ color: "red" }}>
                  {error}
                </ThemedText>
              )}
            </ThemedView>
          </TouchableWithoutFeedback>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});

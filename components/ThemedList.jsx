import { FlatList, TouchableOpacity, View } from "react-native";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import Color from "color";
import { Colors } from "../constants/Colors";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { Ionicons } from "@expo/vector-icons";
import { useRecordsContext } from "../contexts/RecordsContext";
import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import CustomCheckBox from "./CustomCheckBox";
import { v4 } from "uuid";
const ThemedList = ({
  check = false,
  checked = [],
  setChecked,
  search = false,
  data = [],
  style,
  scroll = false,
  date = { month: new Date().getMonth(), year: new Date().getFullYear() },
  ...props
}) => {
  const { dark, language, preferedLocale, numberFormat } =
    useUserPreferencesContext();
  const { records, deleteRecord, selectedAccount, accounts } =
    useRecordsContext();
  const theme = dark ? Colors.dark : Colors.light;
  const borderColor = Color(theme.textColor).alpha("0.5").rgb().string();
  const [openEditRecordModal, setOpenEditRecordModal] = useState({
    open: false,
  });
  return (
    <>
      {records.length > 0 && (
        <ThemedView
          style={{
            padding: 10,
            // margin: 5,
            borderBottomColor: borderColor,
            borderBottomWidth: 1,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <ThemedText
            style={{
              borderRightColor: borderColor,
              borderRightWidth: 1,
              padding: 5,
              width: "25%",
              textAlign: "center",
            }}
          >
            {language == "en" ? "Title" : "الاسم"}
          </ThemedText>
          <ThemedText
            style={{
              padding: 5,
              borderRightColor: borderColor,
              borderRightWidth: 1,
              width: "28%",
              textAlign: "center",
            }}
          >
            {language == "en" ? "Price" : "السعر"}
          </ThemedText>

          <ThemedText
            style={{
              padding: 5,
              width: "30%",
              textAlign: "center",
            }}
          >
            {language == "en" ? "Date" : "التاريخ"}
          </ThemedText>
          <ThemedText
            style={{
              padding: 5,
            }}
          ></ThemedText>
        </ThemedView>
      )}
      <FlatList
        {...props}
        scrollEnabled={scroll}
        data={data}
        renderItem={({ item }) => (
          <ThemedView
            style={{
              padding: 10,
              // margin: 5,
              borderBottomColor: borderColor,
              borderBottomWidth: 1,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                width: "25%",
                flexDirection: "row",
                borderRightColor: borderColor,
                borderRightWidth: 1,
                padding: 5,
                // margin: 5,
                // gap: 10,
                alignItems: "center",
                backgroundColor: checked.includes(item.id)
                  ? "rgba(255,0,0,0.2)"
                  : theme.background,
                // padding: 10,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                position: "relative",
              }}
            >
              {check && (
                <TouchableOpacity
                  onPress={() => {
                    checked.includes(item.id)
                      ? setChecked((prev) => prev.filter((id) => id != item.id))
                      : setChecked((prev) => [...prev, item.id]);
                  }}
                >
                  <CustomCheckBox checked={checked.includes(item.id)} />
                </TouchableOpacity>
              )}
              <ThemedText
                style={{
                  padding: 10,
                  textAlign: check ? "" : "center",
                  insetInlineStart: check ? -10 : 0,
                }}
              >
                {item.title}
              </ThemedText>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "28%",
                alignItems: "center",
              }}
            >
              <ThemedText style={{ width: "10%" }}>
                {item.price > 0 ? (
                  <Ionicons name="arrow-up" size={10} color="green" />
                ) : (
                  <Ionicons name="arrow-down" size={10} color="red" />
                )}
              </ThemedText>
              <ThemedText
                style={{
                  padding: 5,
                  borderRightColor: borderColor,
                  borderRightWidth: 1,
                  width: "90%",
                }}
              >
                {Intl.NumberFormat(
                  numberFormat
                    ? numberFormat
                    : accounts.find((account) => account.id == selectedAccount)
                        ?.currency == "SYP"
                    ? "ar-SY"
                    : "en-US",
                  {
                    style: "currency",
                    currency:
                      accounts.find((account) => account.id == selectedAccount)
                        ?.currency || "SYP",
                    currencyDisplay: "symbol",
                  }
                ).format(item.price < 0 ? item.price * -1 : item.price)}
              </ThemedText>
            </View>

            <ThemedView
              style={{
                padding: 5,
                borderRightColor: borderColor,
                borderRightWidth: 1,
                width: "30%",
                textAlign: "center",
              }}
            >
              <ThemedText style={{ textAlign: "center" }}>
                {Intl.DateTimeFormat(
                  preferedLocale || (language == "en" ? "en-US" : "ar-SY"),
                  { weekday: "short" }
                ).format(new Date(item?.date))}
              </ThemedText>
              <ThemedText style={{ textAlign: "center" }}>
                {Intl.DateTimeFormat(
                  preferedLocale || (language == "en" ? "en-US" : "ar-SY"),
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                ).format(new Date(item?.date))}
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                // alignItems: "center",
                justifyContent: "center",
                width: "20%",
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setOpenEditRecordModal({ open: true, item })}
              >
                <Ionicons name="create-outline" size={20} color={"blue"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecord(item.id)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
        ListEmptyComponent={
          search ? (
            <ThemedText style={{ color: "red" }}>
              {language == "en" ? `No records match"` : `لا يوجد سجلات مطابقة`}
            </ThemedText>
          ) : (
            <ThemedText>
              {language == "en"
                ? `No records in the account "${
                    accounts.find((account) => account.id == selectedAccount)
                      ?.title
                  }"`
                : `لا يوجد سجلات في حساب "${
                    accounts.find((account) => account.id == selectedAccount)
                      ?.title
                  }"`}
            </ThemedText>
          )
        }
      />
      <EditModal
        openModal={openEditRecordModal.open}
        setOpenModal={setOpenEditRecordModal}
        item={openEditRecordModal.item}
      />
    </>
  );
};

export default ThemedList;

import { useSQLiteContext } from "expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useUserPreferencesContext } from "./UserPreferencesContext";
import { pick } from "@react-native-documents/picker";
import { AndroidScoped, Dirs, FileSystem } from "react-native-file-access";
import { ToastAndroid } from "react-native";
const RecordsContext = createContext();

export const RecordsContextProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pending, setPending] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const db = useSQLiteContext();
  const {
    language,
    defaultAccount,
    setLanguage,
    setDark,
    setDefaultAccount,
    setNumberFormat,
    setPreferedLocale,
  } = useUserPreferencesContext();
  useEffect(() => {
    if (accounts.length == 0) return;
    if (defaultAccount) setSelectedAccount(defaultAccount);
    else {
      setSelectedAccount(accounts[0].id);
    }
  }, [defaultAccount, accounts]);
  useEffect(() => {
    (async () => {
      const dBaccounts = await db.getAllAsync("SELECT * FROM accounts;");
      setAccounts(dBaccounts);
    })();
  }, []);
  useEffect(() => {
    if (!selectedAccount) return;
    setPending(true);
    (async () => {
      const data = await db.getAllAsync(
        "SELECT * FROM records WHERE accountId=? ORDER BY date ASC;",
        [selectedAccount]
      );
      setRecords(data);
      setPending(false);
    })();
  }, [selectedAccount, accounts]);
  const createAccount = async (title, currency) => {
    const randomId = v4();
    try {
      await db.runAsync(
        "INSERT INTO accounts (id,title,currency) VALUES (?,?,?);",
        [randomId, title, currency]
      );
      setAccounts((prev) => [
        ...prev,
        { id: randomId, title: title, currency: currency },
      ]);
      ToastAndroid.show(
        language == "en"
          ? "Account created successfully"
          : "تم إنشاء الحساب بنجاح",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en"
          ? "There was an error creating the account"
          : "حدث خطأ في إنشاء الحساب",
        ToastAndroid.LONG
      );
      console.log(error);
    }
  };
  const deleteAccount = async (id) => {
    try {
      await db.runAsync("DELETE FROM accounts WHERE id=?", [id]);
      setAccounts((prev) => prev.filter((account) => account.id != id));
      ToastAndroid.show(
        language == "en" ? "Account deleted" : "تم حذف الحساب",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en"
          ? "There was an error deleting the account"
          : "فشل حذف الحساب",
        ToastAndroid.LONG
      );

      console.log(error);
    }
  };
  const addRecord = async (data) => {
    const randomId = v4();
    try {
      await db.runAsync(
        "INSERT INTO records (id,title,price,date,accountId) VALUES (?,?,?,?,?);",
        [randomId, data.title, data.price, data.date, data.selectedAccount]
      );
      setRecords((prev) => {
        const newItem = {
          id: randomId,
          title: data.title,
          price: data.price,
          date: data.date,
          accountId: data.selectedAccount,
        };
        const newArr = [...prev];
        const index = newArr.findIndex(
          (item) => new Date(newItem.date) < new Date(item.date)
        );
        if (index === -1) newArr.push(newItem);
        else {
          newArr.splice(index, 0, newItem);
        }
        return newArr;
      });
      ToastAndroid.show(
        language == "en" ? "Record added successfully" : "تمت إضافة السجل",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en"
          ? "There was an error addding the record"
          : "فشل إضافة السجل",
        ToastAndroid.SHORT
      );

      console.log(error);
    }
  };
  const editRecord = async (id, data) => {
    try {
      await db.runAsync(
        "UPDATE records SET title=?,price=?,date=? WHERE id=? ;",
        [data.title, data.price, data.date, id]
      );
      setRecords((prev) =>
        prev.map((record) =>
          record.id == id ? { ...record, ...data } : record
        )
      );
      ToastAndroid.show(
        language == "en" ? "Recod edited successfully" : "تم تعديل السجل بنجاح",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en" ? "Couldn't edit the record" : "فشل تعديل السجل",
        ToastAndroid.SHORT
      );

      console.log(error);
    }
  };
  const deleteRecord = async (id) => {
    try {
      await db.runAsync("DELETE FROM records WHERE id=?", [id]);
      setRecords((prev) => prev.filter((record) => record.id != id));
      ToastAndroid.show(
        language == "en" ? "Record deleted successfully" : "تم حذف السجل بنجاح",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en" ? "Couldn't delete the record" : "فشل حذف السجل",
        ToastAndroid.SHORT
      );

      console.log(error);
    }
  };
  const calculateTotals = (month, year, account) => {
    try {
      const result = db.getAllSync(
        "SELECT * FROM records WHERE accountId=? ;",
        [account]
      );
      return result.reduce((acc, item) => {
        if (!acc["expenses"]) acc["expenses"] = 0;
        if (!acc["income"]) acc["income"] = 0;
        const date = new Date(item.date);
        const itemMonth = date.getMonth();
        const itemYear = date.getFullYear();
        if (itemMonth == month && itemYear == year) {
          if (item.price < 0) acc["expenses"] = acc["expenses"] + item.price;
          if (item.price > 0) acc["income"] = acc["income"] + item.price;
        }
        return acc;
      }, {});
    } catch (error) {
      console.log(error);
    }
  };
  const calculateYearTotals = (year, account) => {
    try {
      const result = db.getAllSync(
        "SELECT * FROM records WHERE accountId=? ;",
        [account]
      );
      return result.reduce((acc, item) => {
        if (!acc["expenses"]) acc["expenses"] = 0;
        if (!acc["income"]) acc["income"] = 0;
        const date = new Date(item.date);
        const itemYear = date.getFullYear();
        if (itemYear == year) {
          if (item.price < 0) acc["expenses"] = acc["expenses"] + item.price;
          if (item.price > 0) acc["income"] = acc["income"] + item.price;
        }
        return acc;
      }, {});
    } catch (error) {
      console.log(error);
    }
  };
  const manualExport = async () => {
    try {
      const userPreferences = await db.getAllAsync(
        "SELECT * FROM user_preferences"
      );
      const records = await db.getAllAsync("SELECT * FROM records");
      const accounts = await db.getAllAsync("SELECT * FROM accounts");

      const payload = JSON.stringify({
        userPreferencesTable: JSON.stringify(userPreferences),
        recordsTable: JSON.stringify(records),
        accountsTable: JSON.stringify(accounts),
      });
      return payload;
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        language == "en"
          ? "Could not create a backup"
          : "لم يتم إنشاء النسخة الاحتياطية",
        ToastAndroid.SHORT
      );
      throw language == "en"
        ? "Could not create a backup"
        : "لم يتم إنشاء النسخة الاحتياطية";
    }
  };
  const exportData = async () => {
    try {
      const userPreferences = await db.getAllAsync(
        "SELECT * FROM user_preferences"
      );
      const records = await db.getAllAsync("SELECT * FROM records");
      const accounts = await db.getAllAsync("SELECT * FROM accounts");

      const payload = JSON.stringify({
        userPreferencesTable: JSON.stringify(userPreferences),
        recordsTable: JSON.stringify(records),
        accountsTable: JSON.stringify(accounts),
      });
      let dest = "";
      if (await FileSystem.exists("/sdcard/Download"))
        dest = `/sdcard/Download/Financial-Books-Backup${Intl.DateTimeFormat(
          "en",
          {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
          }
        )
          .format(new Date())
          .replace(/\//g, "-")}.json`;

      if (await FileSystem.exists("/storage/emulated/0/Download"))
        dest = `/storage/emulated/0/Download/Financial-Books-Backup${Intl.DateTimeFormat(
          "en",
          {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
          }
        )
          .format(new Date())
          .replace(/\//g, "-")}.json`;
      if (await FileSystem.exists("/storage/Download"))
        dest = `/storage/Download/Financial-Books-Backup${Intl.DateTimeFormat(
          "en",
          {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
          }
        )
          .format(new Date())
          .replace(/\//g, "-")}.json`;

      // await FileSystem.cp(localPath, dest);
      if (await FileSystem.exists(dest)) await FileSystem.unlink(dest);
      await FileSystem.appendFile(dest, payload, "utf8");
      ToastAndroid.show(
        language == "en"
          ? "The backup was created in the downloads folder"
          : "تم انشاء النسخة الاحتياطية في مجلد التنزيلات",
        ToastAndroid.SHORT
      );
      return language == "en"
        ? "The backup was created in the downloads folder"
        : "تم انشاء النسخة الاحتياطية في مجلد التنزيلات";
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        language == "en"
          ? "Could not create a backup"
          : "لم يتم إنشاء النسخة الاحتياطية",
        ToastAndroid.SHORT
      );
      throw language == "en"
        ? "Could not create a backup"
        : "لم يتم إنشاء النسخة الاحتياطية";
    }
  };
  const importData = async (manual = false, data = {}) => {
    let parsedContent = {};
    if (manual) {
      parsedContent = JSON.parse(data);
      if (Object.keys(parsedContent).length == 0) {
        ToastAndroid.show(
          language == "en"
            ? "File is problematic, please make sure you chose the file provided by the app when you exported the data"
            : "الملف المختار ليس صالحاً, الرجاء التأكد من لصق نفس البيانات التي تم تزويدك بها عندما قمت باستخراج البيانات",
          ToastAndroid.LONG
        );
        throw language == "en"
          ? "File is problematic, please make sure you chose the file provided by the app when you exported the data"
          : "الملف المختار ليس صالحاً, الرجاء التأكد من لصق نفس البيانات التي تم تزويدك بها عندما قمت باستخراج البيانات";
      }
    } else {
      const file = await pick({ allowMultiSelection: false, mode: "import" });
      const content = await FileSystem.readFile(file[0].uri, "utf8");
      parsedContent = JSON.parse(content);
      if (Object.keys(parsedContent).length == 0) {
        ToastAndroid.show(
          language == "en"
            ? "File is problematic, please make sure you chose the file provided by the app when you exported the data"
            : "الملف المختار ليس صالحاً, الرجاء التأكد من اختيار الملف الذي تم تزويدك به عندما قمت باستخراج البيانات",
          ToastAndroid.LONG
        );
        throw language == "en"
          ? "File is problematic, please make sure you chose the file provided by the app when you exported the data"
          : "الملف المختار ليس صالحاً, الرجاء التأكد من اختيار الملف الذي تم تزويدك به عندما قمت باستخراج البيانات";
      }
    }
    try {
      const importedUserPreferences = JSON.parse(
        parsedContent.userPreferencesTable
      );
      const importedAccounts = JSON.parse(parsedContent.accountsTable);
      const importedRecords = JSON.parse(parsedContent.recordsTable);

      if (importedUserPreferences.length > 0)
        importedUserPreferences.map(async (preference) => {
          await db.runAsync(
            "INSERT INTO user_preferences (preference,value) VALUES (?,?)",
            [preference.preference, preference.value]
          );
          if (preference.preference == "language")
            setLanguage(preference.value);
          if (preference.preference == "account")
            setDefaultAccount(preference.value);
          if (preference.preference == "dark")
            setDark(preference.value == "true" ? true : false);
          if (preference.preference == "numberFormat")
            setNumberFormat(preference.value);
          if (preference.preference == "locale")
            setPreferedLocale(preference.value);
        });
      if (importedAccounts.length > 0)
        importedAccounts.map(async (account) => {
          await db.runAsync(
            "INSERT INTO accounts (id,title,currency) VALUES (?,?,?)",
            [account.id, account.title, account.currency]
          );
          if (!accounts.some((item) => item.id == account.id))
            setAccounts((prev) => [...prev, account]);
        });
      if (importedRecords.length > 0)
        importedRecords.map(async (record) => {
          await db.runAsync(
            "INSERT INTO records (id,title,price,accountId,date) VALUES (?,?,?,?,?)",
            [
              record.id,
              record.title,
              record.price,
              record.accountId,
              record.date,
            ]
          );
          if (!records.some((item) => item.id == record.id))
            setRecords((prev) => [...prev, record]);
        });
      ToastAndroid.show(
        language == "en"
          ? "Backup Imported Successfully"
          : "تم استعادة بياناتك بنجاح",
        ToastAndroid.SHORT
      );
    } catch (error) {
      ToastAndroid.show(
        language == "en"
          ? "Could not import backup"
          : "لم يتم استيراد البيانات",
        ToastAndroid.SHORT
      );

      throw language == "en"
        ? "Could not import backup"
        : "لم يتم استيراد البيانات";
    }
  };
  const search = async (title, month, year, selectedAccount) => {
    setPending(true);
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM records WHERE accountId=? ORDER BY date ASC",
        [selectedAccount]
      );
      const searchItems = result.filter(
        (item) =>
          item.title.toLowerCase().includes(title.toLowerCase()) &&
          new Date(item.date).getMonth() == month &&
          new Date(item.date).getFullYear() == year
      );
      const total = searchItems.reduce((acc, item) => (acc += item.price), 0);
      return { list: searchItems, total: total };
    } catch (error) {
      console.log(error);
      throw "Could not search for item";
    } finally {
      setPending(false);
    }
  };
  const searchMonth = async (month, year, selectedAccount) => {
    setPending(true);
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM records WHERE accountId=? ORDER BY date ASC",
        [selectedAccount]
      );
      const searchItems = result.filter(
        (item) =>
          new Date(item.date).getMonth() == month &&
          new Date(item.date).getFullYear() == year
      );
      const total = searchItems.reduce((acc, item) => {
        if (!acc["income"]) acc["income"] = 0;
        if (!acc["expenses"]) acc["expenses"] = 0;
        if (item.price < 0) acc["expenses"] += item.price;
        if (item.price > 0) acc["income"] += item.price;

        return acc;
      }, {});
      return {
        list: searchItems,
        expenses: total["expenses"],
        income: total["income"],
        total: total["income"] + total["expenses"],
      };
    } catch (error) {
      console.log(error);
      throw "Could not search for item";
    } finally {
      setPending(false);
    }
  };
  const calculateSelected = (selected) => {
    const toCalculate = records.filter((item) => selected.includes(item.id));

    try {
      const result = toCalculate.reduce((acc, item) => (acc += item.price), 0);
      console.log(result);

      return result;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <RecordsContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        records,
        addRecord,
        editRecord,
        deleteRecord,
        createAccount,
        deleteAccount,
        calculateTotals,
        calculateYearTotals,
        exportData,
        importData,
        search,
        searchMonth,
        pending,
        calculateSelected,
        manualExport,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecordsContext = () => useContext(RecordsContext);

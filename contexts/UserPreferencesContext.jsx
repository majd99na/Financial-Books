import { reloadAppAsync } from "expo";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";

const usePreferencesContext = createContext();

export const UserPreferencesContextProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [language, setLanguage] = useState("en");
  const [preferedLocale, setPreferedLocale] = useState("");
  const [numberFormat, setNumberFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const db = useSQLiteContext();
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await db.getAllAsync("SELECT * FROM user_preferences");
        if (result.length > 0)
          result.map((result) => {
            if (result.preference == "dark")
              setDark(result?.value == "true" ? true : false);
            if (result.preference == "account")
              setDefaultAccount(result?.value);
            if (result.preference == "language") setLanguage(result?.value);
            if (result.preference == "locale") setPreferedLocale(result?.value);
            if (result.preference == "numberFormat")
              setNumberFormat(result?.value);
          });
        // I18nManager.allowRTL(false);
        // I18nManager.forceRTL(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    // return;
    setLoading(true);
    (async () => {
      try {
        const result = await db.getAllAsync(
          "SELECT * FROM user_preferences WHERE preference=? ;",
          ["language"]
        );
        if (!result[0]) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }
        if (result[0]?.value == "ar") {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          if (!I18nManager.isRTL) reloadAppAsync();
          // return;
        }
        if (result[0]?.value == "en") {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          if (I18nManager.isRTL) reloadAppAsync();
          // return;
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [language]);
  const addPreference = async (preference, value) => {
    try {
      await db.runAsync(
        "INSERT INTO user_preferences (preference,value) VALUES (?,?);",
        [preference, value]
      );
    } catch (error) {
      console.log(error);
    }
  };
  const deletePreference = async (preference) => {
    try {
      await db.runAsync("DELETE FROM user_preferences WHERE preference=? ;", [
        preference,
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <usePreferencesContext.Provider
      value={{
        dark,
        setDark,
        defaultAccount,
        setDefaultAccount,
        addPreference,
        deletePreference,
        language,
        setLanguage,
        loading,
        preferedLocale,
        setPreferedLocale,
        numberFormat,
        setNumberFormat,
      }}
    >
      {children}
    </usePreferencesContext.Provider>
  );
};

export const useUserPreferencesContext = () =>
  useContext(usePreferencesContext);

import { ExpoRoot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { UserPreferencesContextProvider } from "./contexts/UserPreferencesContext";
import { v4 } from "uuid";
export default function App() {
  const ctx = require.context("./app");

  return (
    <SQLiteProvider
      databaseName="books"
      onInit={async (db) => {
        await db.execAsync(
          "CREATE TABLE IF NOT EXISTS accounts (id uuid NOT NULL PRIMARY KEY, title TEXT NOT NULL,currency TEXT NOT NULL);"
        );
        await db.execAsync(
          "CREATE TABLE IF NOT EXISTS user_preferences (preference TEXT NOT NULL UNIQUE,value TEXT NOT NULL);"
        );
        await db.execAsync(
          "CREATE TABLE IF NOT EXISTS records (id uuid NOT NULL PRIMARY KEY, title TEXT NOT NULL, price number NOT NULL, accountId uuid NOT NULL,date DATE, FOREIGN KEY (accountId) REFERENCES accounts(id));"
        );
      }}
      options={{ useNewConnection: false }}
    >
      <UserPreferencesContextProvider>
        <ExpoRoot context={ctx} key={v4()} />
      </UserPreferencesContextProvider>
    </SQLiteProvider>
  );
}

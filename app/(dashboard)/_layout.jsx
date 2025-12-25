import { ActivityIndicator, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  RecordsContextProvider,
  useRecordsContext,
} from "../../contexts/RecordsContext";
import { useUserPreferencesContext } from "../../contexts/UserPreferencesContext";
import { v4 } from "uuid";
import ThemedView from "../../components/ThemedView";
const _layout = () => {
  const { dark, language, loading } = useUserPreferencesContext();
  if (loading)
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={50} color="purple" />
      </ThemedView>
    );
  return (
    <ThemedView style={{ flex: 1, backgroundColor: "black" }}>
      <Tabs
        key={v4()}
        screenOptions={{
          animation: "shift",
          tabBarActiveTintColor: dark ? "white" : "black",
          tabBarInactiveTintColor: dark
            ? "rgba(255,255,255,0.4)"
            : "rgba(0,0,0,0.4)",
          tabBarStyle: {
            backgroundColor: dark ? "black" : "white",
            borderColor: dark ? "white" : "black",
          },
          headerStyle: { backgroundColor: dark ? "black" : "white" },
          headerTitleStyle: {
            color: dark ? "white" : "black",
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="records"
          options={{
            title: language == "en" ? "Records" : "السجلات",
            headerStyle: {
              backgroundColor: dark ? "black" : "white",
            },
            headerTintColor: dark ? "white" : "black",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="book"
                  size={20}
                  color={dark ? "white" : "black"}
                />
              ) : (
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                />
              ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: language == "en" ? "Add a record" : "إضافة سجل",
            headerStyle: { backgroundColor: dark ? "black" : "white" },
            headerTintColor: dark ? "white" : "black",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="add"
                  size={20}
                  color={dark ? "white" : "black"}
                />
              ) : (
                <Ionicons
                  name="add-outline"
                  size={20}
                  color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                />
              ),
          }}
        />
        <Tabs.Screen
          name="accounts"
          options={{
            title: language == "en" ? "Accounts" : "الحسابات",
            headerStyle: { backgroundColor: dark ? "black" : "white" },
            headerTintColor: dark ? "white" : "black",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="person"
                  size={20}
                  color={dark ? "white" : "black"}
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                />
              ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: language == "en" ? "Search" : "بحث",
            headerStyle: {
              backgroundColor: dark ? "black" : "white",
            },
            headerTintColor: dark ? "white" : "black",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="search-circle"
                  size={30}
                  color={dark ? "white" : "black"}
                />
              ) : (
                <Ionicons
                  name="search"
                  size={20}
                  color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                />
              ),
          }}
        />
        <Tabs.Screen
          name="monthRecord"
          options={{
            title: language == "en" ? "Monthly Records" : "سجلات شهرية",
            headerStyle: {
              backgroundColor: dark ? "black" : "white",
            },
            headerTintColor: dark ? "white" : "black",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="time"
                  size={30}
                  color={dark ? "white" : "black"}
                />
              ) : (
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                />
              ),
          }}
        />
      </Tabs>
    </ThemedView>
  );
};

export default _layout;

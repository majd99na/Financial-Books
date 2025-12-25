import {
  ActivityIndicator,
  I18nManager,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, router } from "expo-router";
import { Colors } from "../constants/Colors.js";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../components/ThemedView.jsx";
import ThemedText from "../components/ThemedText.jsx";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext.jsx";
import { StatusBar } from "expo-status-bar";
import { v4 } from "uuid";
import { RecordsContextProvider } from "../contexts/RecordsContext.jsx";
const _layout = () => {
  // if (I18nManager.isRTL !== true) {
  // I18nManager.allowRTL(true);
  // I18nManager.forceRTL(true);
  // Restart the app for changes to take effect
  // }
  const { dark, language, loading } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
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
    <>
      <RecordsContextProvider>
        <StatusBar style={dark ? "light" : "dark"} />
        <Stack
          key={v4()}
          screenOptions={{
            headerStyle: {
              backgroundColor: dark ? "black" : "white",
            },
            headerTitleStyle: { fontWeight: "bold" },
            headerTintColor: dark ? "white" : "black",
            headerTitleAlign: "left",
            headerRight: () => (
              <ThemedView>
                <TouchableOpacity onPress={() => router.navigate("settings")}>
                  <Ionicons
                    name="settings-outline"
                    size={25}
                    color={theme.textColor}
                  />
                </TouchableOpacity>
              </ThemedView>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "About",
              // headerTitleAlign: "center",
              headerTitleStyle: { left: 0, right: 0 },
              headerTitle: () => (
                <ThemedView
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="home" size={20} color={theme.textColor} />
                  <ThemedText title style={{ fontSize: 20 }}>
                    {language == "en" ? "Home" : "الصفحة الرئيسية"}
                  </ThemedText>
                </ThemedView>
              ),
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              title: "About",
              headerTitleAlign: "center",
              headerTitle: () => (
                <ThemedView
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color={theme.textColor}
                  />
                  <ThemedText title style={{ fontSize: 20 }}>
                    {language == "en" ? "About" : "حول"}
                  </ThemedText>
                </ThemedView>
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: language == "en" ? "Settings" : "الاعدادات",
              // headerTitleAlign: "left",
              headerLeft: () => (I18nManager.isRTL ? <View /> : null),
              headerRight: () =>
                I18nManager.isRTL ? (
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                      name="arrow-forward"
                      size={24}
                      color={theme.textColor}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
      </RecordsContextProvider>
    </>
  );
};
export default _layout;

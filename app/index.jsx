import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import { Link, router, useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";
import { Ionicons } from "@expo/vector-icons";
const index = () => {
  const { dark, language, loading } = useUserPreferencesContext();
  const theme = dark ? Colors.dark : Colors.light;
  const router = useRouter();
  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.cardsContainer}>
        {/* <Link href="/records" style={styles.card}> */}
        <TouchableOpacity
          style={[
            styles.card,
            { height: "35%", backgroundColor: theme.uiColor },
          ]}
          onPress={() => router.navigate("/records")}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="book" size={25} color={dark ? "black" : "white"} />
            <ThemedText
              style={{ color: dark ? "black" : "white", fontSize: 15 }}
              title
            >
              {language == "en" ? "Records" : "إدارة السجلات"}
            </ThemedText>
          </View>
        </TouchableOpacity>
        {/* </Link> */}
        {/* <Link style={{ width: "30%" }} href="/about"> */}
        <TouchableOpacity
          style={[
            styles.card,
            { height: "35%", backgroundColor: theme.uiColor },
          ]}
          onPress={() => router.navigate("/about")}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Ionicons
              name="information-circle"
              size={25}
              color={dark ? "black" : "white"}
            />
            <ThemedText
              style={{ color: dark ? "black" : "white", fontSize: 15 }}
              title
            >
              {language == "en" ? "About" : "حول"}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 100,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 5,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

import { StyleSheet } from "react-native";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import { Link } from "expo-router";
import { useUserPreferencesContext } from "../contexts/UserPreferencesContext";

const about = () => {
  const { language } = useUserPreferencesContext();
  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        {language == "en"
          ? "This app is to keep track of your finances, you can create multiple accounts with different curencies. Main features include adding an income or expense and auto calculate totals depending on the period chosen."
          : "هذا التطبيق يساعدك على أن تبقى على إطلاع على سجلاتك المالية على الدوام, يمكنك إنشاء عدة حسابات بعملات مختلفة. الميزات الأساسية تتضمن إضافة دخل أو صرف مع القدرة على الحساب الآلي بما يتناسب مع اختيارك الشخصي للشهر و السنة"}
      </ThemedText>
      <ThemedText>
        {language == "en"
          ? "Was developed by Naim Majd"
          : "تم تطويره بواسطة مجد نعيم"}
      </ThemedText>
      <ThemedText title>
        <Link style={{ color: "blue" }} href={"https://github.com/majd99na"}>
          Github
        </Link>
      </ThemedText>
    </ThemedView>
  );
};

export default about;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

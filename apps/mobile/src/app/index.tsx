import { welcomeMessage } from "@internium/backend";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Text style={{ fontSize: 14, color: "#000000" }}>{welcomeMessage}</Text>
    </View>
  );
}

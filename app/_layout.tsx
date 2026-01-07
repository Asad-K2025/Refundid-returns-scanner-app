import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { ReturnsProvider } from "../context/ReturnsContext";

export default function RootLayout() {
  return (
    <ReturnsProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="loading" />
          <Stack.Screen name="details" />
          <Stack.Screen name="decline" />
          <Stack.Screen name="result" />
        </Stack>

        <Toast />
      </View>
    </ReturnsProvider>
  );
}

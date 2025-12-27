import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Welcome */}
      <Stack.Screen name="index" />

      {/* Auth Screens */}
      <Stack.Screen name="Authentication/login" />
      <Stack.Screen name="Authentication/signup" />

      {/* Tabs */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Welcome */}
      <Stack.Screen name="index" />

      {/* Auth Screens */}
      <Stack.Screen name="authentication/login" />
      <Stack.Screen name="authentication/signup" />
      <Stack.Screen name="(main)"/>

      {/* Tabs */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
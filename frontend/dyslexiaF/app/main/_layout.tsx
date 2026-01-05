import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard/index" />
      <Stack.Screen name="screening/index" />
      <Stack.Screen name="solutions/index" />
      {/* <Stack.Screen name="profile/index" /> */}
    </Stack>
  );
}

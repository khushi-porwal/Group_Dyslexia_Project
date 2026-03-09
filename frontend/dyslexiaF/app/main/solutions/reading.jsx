import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ReadingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-purple-400 px-5">
      <Text className="text-2xl text-center mt-16 font-bold">
        Reading Assistant
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/modal?type=typing")}
        className="bg-purple-200 p-4 rounded-xl mt-5"
      >
        <Text>Typing ✨</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/modal?type=listening")}
        className="bg-purple-200 p-4 rounded-xl mt-3"
      >
        <Text>Listening 🎤</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/scanner")}
        className="bg-purple-200 p-4 rounded-xl mt-3"
      >
        <Text>Scanner 📷</Text>
      </TouchableOpacity>
    </View>
  );
}
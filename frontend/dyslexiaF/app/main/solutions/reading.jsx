import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ReadingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-100 px-5 py-10 gap-4">
      <Text className="text-3xl text-center font-bold text-slate-900">
        Reading Assistant
      </Text>
      <Text className="text-center text-slate-600">
        Choose a mode to help the child practise reading with feedback.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/modal?type=typing")}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
      >
        <Text className="text-lg font-semibold text-slate-900">
          Typing mode
        </Text>
        <Text className="text-slate-600 mt-1">
          Child types the sentence. We suggest words and highlight mistakes.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/modal?type=listening")}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
      >
        <Text className="text-lg font-semibold text-slate-900">
          Voice listening mode
        </Text>
        <Text className="text-slate-600 mt-1">
          Record the child reading aloud and compare to the reference text.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/scanner")}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
      >
        <Text className="text-lg font-semibold text-slate-900">Scanner</Text>
        <Text className="text-slate-600 mt-1">
          Capture printed text with the camera, read it aloud, and compare with
          speech.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

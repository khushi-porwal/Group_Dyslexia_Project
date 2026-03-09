import { Text, TouchableOpacity, View } from "react-native";

export default function SuggestionList({ suggestions = [], setText }) {
  if (!suggestions.length) return null;

  return (
    <View className="flex-row flex-wrap gap-2 mt-3">
      {suggestions.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setText((prev) => `${prev.trim()} ${item}`.trim())}
          className="bg-slate-200 rounded-full px-3 py-1"
        >
          <Text className="text-slate-900">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

import { Text, TouchableOpacity } from "react-native";

export default function SuggestionList({ suggestions, setText }) {
  return (
    <>
      {suggestions.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => setText(item)}>
          <Text className="text-lg mt-2">{item}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useMemo, useState, useEffect } from "react";
import  API  from "../../app/api/axios";
import VoiceListener from "./VoiceListener";
import SuggestionList from "./SuggestionList";

export default function ReadingBottomSheet({ type }) {
  const snapPoints = useMemo(() => ["45%"], []);

  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    if (!text) return setSuggestions([]);

    const fetchSuggestions = async () => {
      const res = await API.get(`/reading/suggestions?input=${text}`);
      setSuggestions(res.data);
    };

    fetchSuggestions();
  }, [text]);

  const analyzeText = async () => {
    const res = await API.post("/reading/analyze", { text });
    setMistakes(res.data.mistakes);
  };

  const renderContent = () => {
    if (type === "typing") {
      return (
        <View className="p-5">
          <TextInput
            placeholder="Type here..."
            value={text}
            onChangeText={setText}
            className="bg-white p-3 rounded-xl"
          />

          <SuggestionList suggestions={suggestions} setText={setText} />

          <TouchableOpacity
            onPress={analyzeText}
            className="bg-red-600 p-3 rounded-xl mt-4"
          >
            <Text className="text-white text-center">
              Detect Errors ✨
            </Text>
          </TouchableOpacity>

          <Text className="text-red-500 mt-2">
            {mistakes.join(", ")}
          </Text>
        </View>
      );
    }

    if (type === "listening") {
      return (
        <View className="p-5">
          <VoiceListener setText={setText} />
        </View>
      );
    }
  };

  return (
    <BlurView intensity={40} className="flex-1 justify-end">
      <BottomSheet snapPoints={snapPoints}>
        {renderContent()}
      </BottomSheet>
    </BlurView>
  );
}
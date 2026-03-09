import { View, Text, TouchableOpacity } from "react-native";
import * as SpeechRecognition from "expo-speech-recognition";
import { useState } from "react";

export default function VoiceListener({ setText }) {
  const [result, setResult] = useState("");

  const startListening = async () => {
    const permission = await SpeechRecognition.requestPermissionsAsync();
    if (!permission.granted) return;

    SpeechRecognition.start({
      onResult: (res) => {
        setResult(res.transcript);
        setText(res.transcript);
      },
    });
  };

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={startListening}
        className="bg-purple-600 px-5 py-3 rounded-xl"
      >
        <Text className="text-white">Start Listening 🎤</Text>
      </TouchableOpacity>

      <Text className="mt-3 text-lg">{result}</Text>
    </View>
  );
}
import { View, Text, TouchableOpacity } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useState, useCallback } from "react";

export default function VoiceListener({ onResult, label = "Start Listening" }) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  useSpeechRecognitionEvent("result", (event) => {
    const text = event?.results?.[0]?.transcript || "";
    setTranscript(text);
    onResult?.(text);
  });

  useSpeechRecognitionEvent("end", () => setListening(false));

  const toggleListening = useCallback(async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission?.granted) {
      console.warn("Microphone permission not granted");
      return;
    }

    setListening(true);
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  }, [listening]);

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={toggleListening}
        className={`px-5 py-3 rounded-xl ${
          listening ? "bg-amber-500" : "bg-purple-600"
        }`}
      >
        <Text className="text-white">
          {listening ? "Stop Listening" : label}
        </Text>
      </TouchableOpacity>

      {!!transcript && <Text className="mt-3 text-lg">{transcript}</Text>}
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "expo-text-recognition";
import * as Speech from "expo-speech";
import { useRef, useState } from "react";
import API from "./api/axios";
import TextHighlighter from "../components/reading/TextHighlighter";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [scannedText, setScannedText] = useState("");
  const [mistakes, setMistakes] = useState([]);

  if (!permission?.granted) {
    requestPermission();
    return <Text>Requesting Camera...</Text>;
  }

  const scanText = async () => {
    const photo = await cameraRef.current.takePictureAsync();

    const result = await TextRecognition.recognize(photo.uri);
    const detectedText = result.join(" ");

    setScannedText(detectedText);
    setMistakes([]);
  };

  const readAloud = () => {
    Speech.speak(scannedText, { rate: 0.8 });
  };

  const analyzeText = async () => {
    const res = await API.post("/reading/analyze", {
      text: scannedText,
    });

    setMistakes(res.data.mistakes);
  };

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} className="flex-1" />

      <TouchableOpacity onPress={scanText} className="bg-purple-600 p-4">
        <Text className="text-white text-center">Scan Text 📷</Text>
      </TouchableOpacity>

      <View className="bg-white p-4">
        <Text className="text-lg font-bold">Result:</Text>

        <TextHighlighter text={scannedText} mistakes={mistakes} />

        <TouchableOpacity
          onPress={readAloud}
          className="bg-blue-600 p-3 rounded-xl mt-3"
        >
          <Text className="text-white text-center">Read Aloud 🔊</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={analyzeText}
          className="bg-red-600 p-3 rounded-xl mt-2"
        >
          <Text className="text-white text-center">Detect Errors ✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
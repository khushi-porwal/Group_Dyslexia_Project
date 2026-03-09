import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "expo-text-recognition";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import API from "./api/axios";
import TextHighlighter from "../components/reading/TextHighlighter";
import VoiceListener from "../components/reading/VoiceListener";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [scannedText, setScannedText] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <Text className="text-center px-4">
          We need camera access to scan printed text.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-indigo-600 px-4 py-3 rounded-xl"
        >
          <Text className="text-white">Allow camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanText = async () => {
    if (!cameraRef.current) return;
    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      const result = await TextRecognition.recognize(photo.uri);
      const detectedText = Array.isArray(result) ? result.join(" ") : "";
      setScannedText(detectedText);
      setMistakes([]);
      setSpokenText("");
    } catch (error) {
      console.log("scan error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const readAloud = () => {
    if (!scannedText) return;
    Speech.stop();
    Speech.speak(scannedText, { rate: 0.75, pitch: 0.9, language: "en-US" });
  };

  const analyzeText = async (incomingSpeech) => {
    const actual = incomingSpeech ?? spokenText;
    if (!scannedText || !actual) return;
    try {
      setAnalyzing(true);
      const res = await API.post("/reading/analyze", {
        expectedText: scannedText,
        actualText: actual,
        mode: "scanner",
      });
      setMistakes(res.data?.mistakes || []);
    } catch (error) {
      console.log("analyze error", error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="h-2/5 bg-black">
        <CameraView ref={cameraRef} className="flex-1" />
        <TouchableOpacity
          onPress={scanText}
          className="absolute bottom-4 self-center bg-white px-5 py-3 rounded-full"
        >
          <Text className="text-slate-900 font-semibold">
            {loading ? "Scanning..." : "Scan text"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 12 }}>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <Text className="text-lg font-semibold text-slate-900">
            Scanned text
          </Text>
          {loading ? (
            <ActivityIndicator className="mt-3" />
          ) : (
            <Text className="text-slate-700 mt-2">
              {scannedText || "No text captured yet."}
            </Text>
          )}

          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity
              onPress={readAloud}
              disabled={!scannedText}
              className={`flex-1 px-3 py-2 rounded-xl ${
                scannedText ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <Text
                className={`text-center ${
                  scannedText ? "text-white" : "text-slate-400"
                }`}
              >
                Read aloud (slow)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <Text className="text-lg font-semibold text-slate-900">
            Child's speech
          </Text>
          <VoiceListener
            onResult={(speech) => {
              setSpokenText(speech);
              analyzeText(speech);
            }}
            label="Listen & compare"
          />

          <Text className="text-slate-600 mt-3">Detected speech</Text>
          <TextHighlighter text={spokenText} mistakes={mistakes} />

          <TouchableOpacity
            onPress={() => analyzeText()}
            disabled={!spokenText || analyzing}
            className={`mt-3 px-4 py-3 rounded-xl ${
              spokenText ? "bg-rose-600" : "bg-slate-200"
            }`}
          >
            <Text
              className={`text-center ${
                spokenText ? "text-white" : "text-slate-400"
              }`}
            >
              {analyzing ? "Checking..." : "Detect errors"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

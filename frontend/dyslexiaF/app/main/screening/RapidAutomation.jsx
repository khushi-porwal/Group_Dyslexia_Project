import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import axios from "axios";
import { captureRef } from "react-native-view-shot";

const BASE_URL = "http://192.168.0.183:5000"; // change if needed

export default function RapidWritingScreen() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const drawingRef = useRef(null);

  /* ============================
     LOAD CONFIG
  ============================ */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/rapid-automated/config`)
      .then((res) => {
        if (!res.data?.data) return;
        setCategories(res.data.data.categories);
        setWords(res.data.data.words);
      })
      .catch(() => Alert.alert("Failed to load data"));
  }, []);

  /* ============================
     DRAWING LOGIC
  ============================ */
  const onGestureEvent = (event) => {
    const { x, y } = event.nativeEvent;
    setCurrentPath((prev) =>
      `${prev} ${prev === "" ? "M" : "L"} ${x} ${y}`
    );
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END && currentPath) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath("");
    }
  };

  const handleWordSelect = (word) => {
    setSelectedWord(word);
    setPaths([]);
    setCurrentPath("");
    setResult(null);
  };

  /* ============================
     URI → BASE64
  ============================ */
  const uriToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  /* ============================
     SUBMIT DRAWING
  ============================ */
  const handleResult = async () => {
    if (!selectedWord) {
      Alert.alert("Select a word first");
      return;
    }

    // 🔴 IMPORTANT VALIDATION
    if (paths.length < 3) {
      Alert.alert("Draw more clearly before checking");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // 1️⃣ Capture drawing
      const imageUri = await captureRef(drawingRef, {
        format: "png",
        quality: 1,
      });

      // 2️⃣ Convert to Base64
      const base64Image = await uriToBase64(imageUri);

      // 3️⃣ Send to backend
      const response = await axios.post(`${BASE_URL}/api/rapid-automated/evaluate`, {
  userId: "demo-user-1",
  wordId: selectedWord._id,
  image: base64Image,
  strokesCount: paths.length, // 🔥 REQUIRED
});

      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      Alert.alert("Could not evaluate drawing");
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     UI
  ============================ */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-lime-400 p-4">

        {/* HEADER */}
        <View className="items-center mt-6 mb-3">
          <Text className="text-2xl font-bold">
            Rapid Automated Writing
          </Text>
        </View>

        {/* WORD PREVIEW */}
        {selectedWord && (
          <View className="bg-white rounded-xl p-3 items-center mb-4 shadow">
            <Text className="font-semibold mb-2">
              Draw this: {selectedWord.displayText}
            </Text>

            <Image
              source={{ uri: `${BASE_URL}${selectedWord.imageUrl}` }}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
          </View>
        )}

        {/* DRAWING AREA */}
        <Text className="text-center font-semibold mb-2">
          Drawing Area
        </Text>

        <View
          ref={drawingRef}
          collapsable={false}
          style={{
            backgroundColor: "white",
            height: 256,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <View style={{ flex: 1 }}>
              <Svg height="100%" width="100%">
                {paths.map((p, i) => (
                  <Path
                    key={i}
                    d={p}
                    stroke="black"
                    strokeWidth={4}
                    fill="none"
                  />
                ))}
                <Path
                  d={currentPath}
                  stroke="black"
                  strokeWidth={4}
                  fill="none"
                />
              </Svg>
            </View>
          </PanGestureHandler>
        </View>

        {/* WORD LIST */}
        {categories.map((category) => {
          const categoryWords = words.filter(
            (w) =>
              String(w.category?._id || w.category) ===
              String(category.id)
          );

          if (!categoryWords.length) return null;

          return (
            <View key={category.id} className="mb-4">
              <Text className="text-lg font-bold mb-2">
                {category.name}
              </Text>

              <View className="flex-row flex-wrap justify-center">
                {categoryWords.map((word) => (
                  <View key={word._id} className="m-1">
                    <Chip
                      label={word.displayText}
                      selected={selectedWord?._id === word._id}
                      onPress={() => handleWordSelect(word)}
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          onPress={handleResult}
          disabled={loading}
          className="bg-green-800 py-4 rounded-full items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">
              Check Drawing
            </Text>
          )}
        </TouchableOpacity>

        {/* RESULT */}
        {result && (
          <View
            className={`mt-4 p-3 rounded-xl ${
              result === "correct"
                ? "bg-green-200"
                : result === "almost"
                ? "bg-yellow-200"
                : "bg-red-200"
            }`}
          >
            <Text className="text-center font-bold text-lg">
              {result === "correct"
                ? "Recognized Correctly 🎉"
                : result === "almost"
                ? "Almost There ✨ Try clearer strokes"
                : "Not Recognized ❌ Try Again"}
            </Text>
          </View>
        )}

      </ScrollView>
    </GestureHandlerRootView>
  );
}

/* CHIP */
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-5 py-2 rounded-full ${
      selected ? "bg-black" : "bg-indigo-600"
    }`}
  >
    <Text className="text-white font-bold">{label}</Text>
  </TouchableOpacity>
);
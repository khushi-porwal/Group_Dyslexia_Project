import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import axios from "axios";
import { captureRef } from "react-native-view-shot";

const BASE_URL = "http://192.168.0.183:5000";

export default function RapidWritingScreen() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [result, setResult] = useState(null);

  // 🔑 REF FOR PNG CAPTURE
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
      .catch(console.error);
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
     TASK 1: DRAWING → PNG
  ============================ */
  const handleResult = async () => {
    if (!selectedWord) {
      Alert.alert("Select a word first");
      return;
    }

    if (paths.length < 1) {
      Alert.alert("Please draw first");
      return;
    }

    try {
      // 📸 Convert drawing to PNG
      const imageUri = await captureRef(drawingRef, {
        format: "png",
        quality: 1,
      });

      console.log("✅ DRAWING PNG:", imageUri);

      Alert.alert(
        "PNG Generated Successfully 🎉",
        imageUri
      );

      // 🚫 Backend / ML comes in TASK-2
    } catch (error) {
      console.error("❌ PNG Capture Failed", error);
      Alert.alert("Failed to capture drawing");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-lime-400 p-4">

        {/* HEADER */}
        <View className="items-center mt-6 mb-3">
          <Text className="text-2xl font-bold">
            Rapid Automated Writing
          </Text>
        </View>

        {/* IMAGE PREVIEW */}
        {selectedWord && (
          <View className="bg-white rounded-xl p-3 items-center mb-4 shadow">
            <Text className="font-semibold mb-2">
              Draw this: {selectedWord.displayText}
            </Text>

            {selectedWord.imageUrl ? (
              <Image
                source={{ uri: `${BASE_URL}${selectedWord.imageUrl}` }}
                style={{ width: 140, height: 140 }}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ color: "red" }}>
                Image not available
              </Text>
            )}
          </View>
        )}

        {/* DRAWING AREA (PNG SOURCE) */}
        <Text className="text-center font-semibold mb-2">
          Interactive Drawing Area
        </Text>

        <View
          ref={drawingRef}
          collapsable={false}   // 🔑 REQUIRED FOR ANDROID
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

          if (categoryWords.length === 0) return null;

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

        {/* RESULT BUTTON */}
        <TouchableOpacity
          onPress={handleResult}
          className="bg-green-800 py-4 rounded-full items-center"
        >
          <Text className="text-white font-bold">
            Generate PNG
          </Text>
        </TouchableOpacity>

        {/* RESULT */}
        {result && (
          <View
            className={`mt-4 p-3 rounded-xl ${
              result === "correct"
                ? "bg-green-200"
                : "bg-red-200"
            }`}
          >
            <Text className="text-center font-bold text-lg">
              {result === "correct"
                ? "Correct Writing 🎉"
                : "Wrong Writing ❌ Try Again"}
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

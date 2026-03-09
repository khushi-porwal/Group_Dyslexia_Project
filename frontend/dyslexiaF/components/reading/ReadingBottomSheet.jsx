import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Speech from "expo-speech";
import { useMemo, useState, useEffect, useCallback } from "react";
import API from "../../app/api/axios";
import VoiceListener from "./VoiceListener";
import SuggestionList from "./SuggestionList";
import TextHighlighter from "./TextHighlighter";

export default function ReadingBottomSheet({ type }) {
  const snapPoints = useMemo(() => ["60%"], []);
  const mode = Array.isArray(type) ? type[0] : type || "typing";

  const [expectedText, setExpectedText] = useState("");
  const [userText, setUserText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (mode !== "typing") return;
    if (!userText) return setSuggestions([]);

    const latestWord = userText.trim().split(/\s+/).pop();
    if (!latestWord) return setSuggestions([]);

    const fetchSuggestions = async () => {
      try {
        const res = await API.get("/reading/suggestions", {
          params: { input: latestWord },
        });
        setSuggestions(res.data || []);
      } catch (error) {
        console.log("suggestions error", error.message);
      }
    };

    fetchSuggestions();
  }, [mode, userText]);

  const handleAnalyze = useCallback(
    async (incomingText) => {
      const payload = {
        expectedText: expectedText || userText,
        actualText: incomingText ?? userText,
        mode,
      };

      if (!payload.actualText?.trim()) {
        setMistakes([]);
        return;
      }

      try {
        setIsAnalyzing(true);
        const res = await API.post("/reading/analyze", payload);
        setMistakes(res.data?.mistakes || []);
      } catch (error) {
        console.log("analyze error", error.message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [expectedText, userText, mode]
  );

  const handleSpeak = (textToRead) => {
    const content = textToRead || expectedText || userText;
    if (!content) return;

    Speech.stop();
    Speech.speak(content, {
      language: "en-US",
      rate: 0.75,
      pitch: 0.9,
    });
  };

  const handleClear = () => {
    setUserText("");
    setExpectedText("");
    setMistakes([]);
    setSuggestions([]);
    Speech.stop();
  };

  const renderTyping = () => (
    <ScrollView className="p-5" keyboardShouldPersistTaps="handled">
      <Text className="text-sm text-slate-500 mb-2">
        Reference text (what the child should read)
      </Text>
      <TextInput
        placeholder="Paste or type the target text..."
        value={expectedText}
        onChangeText={setExpectedText}
        multiline
        className="bg-white p-3 rounded-xl border border-slate-200"
      />

      <Text className="text-sm text-slate-500 mt-4 mb-2">
        Child's typed text
      </Text>
      <TextInput
        placeholder="Start typing..."
        value={userText}
        onChangeText={setUserText}
        multiline
        className="bg-white p-3 rounded-xl border border-slate-200"
      />

      <SuggestionList suggestions={suggestions} setText={setUserText} />

      <TextHighlighter text={userText} mistakes={mistakes} />

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          onPress={() => handleSpeak(expectedText)}
          className="flex-1 bg-indigo-600 p-3 rounded-xl"
        >
          <Text className="text-white text-center">Read Aloud (slow)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          className="flex-1 bg-slate-200 p-3 rounded-xl"
        >
          <Text className="text-center text-slate-900">Clear</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleAnalyze()}
        className="bg-rose-600 p-3 rounded-xl mt-3"
        disabled={isAnalyzing}
      >
        <Text className="text-white text-center">
          {isAnalyzing ? "Checking..." : "Detect Errors"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderListening = () => (
    <View className="p-5 gap-3">
      <Text className="text-sm text-slate-500">
        Reference text (read aloud to compare)
      </Text>
      <TextInput
        placeholder="Enter the sentence the child will read aloud..."
        value={expectedText}
        onChangeText={setExpectedText}
        multiline
        className="bg-white p-3 rounded-xl border border-slate-200"
      />

      <VoiceListener
        onResult={(spokenText) => {
          setUserText(spokenText);
          handleAnalyze(spokenText);
        }}
      />

      <Text className="text-slate-600 mt-2">Transcription</Text>
      <TextHighlighter text={userText} mistakes={mistakes} />

      <TouchableOpacity
        onPress={() => handleSpeak(expectedText)}
        className="bg-indigo-600 p-3 rounded-xl"
      >
        <Text className="text-white text-center">Play Reference Slowly</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <BlurView intensity={40} className="flex-1 justify-end">
      <BottomSheet snapPoints={snapPoints} enablePanDownToClose>
        {mode === "listening" ? renderListening() : renderTyping()}
      </BottomSheet>
    </BlurView>
  );
}

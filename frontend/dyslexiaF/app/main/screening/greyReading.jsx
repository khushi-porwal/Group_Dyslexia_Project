import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function GreyReadingScreen({ navigation }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    loadToken();
  }, []);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [isRunning]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return { m, s };
  };

  const { m, s } = formatTime(seconds);

  const handleFinish = async () => {
    try {
      if (!token || seconds === 0) return;

      setIsRunning(false);

      const response = await fetch(
        "http://192.168.0.126:5000/api/history/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activityType: "grey_reading",
            duration: seconds,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#DDA6F6]">

      {/* ✅ KEY FIX → ScrollView */}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 40,  // ✅ Prevent bottom cut
        }}
        showsVerticalScrollIndicator={false}
      >

        <View className="w-full px-5 pt-4">

          {/* Header */}
          <View className="w-full flex-row justify-between items-center">
            <TouchableOpacity
              className="w-10 h-10 rounded-full items-center justify-center"
              onPress={() => navigation?.goBack?.()}
            >
              <Ionicons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="person" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text className="text-[26px] font-extrabold text-black text-center mt-4">
            Grey Oral Reading{"\n"}Test
          </Text>
        </View>

        {/* Illustration */}
        <View className="mt-8 w-[85%] h-[190px] items-center justify-center">
          <Image
            source={require("../../../assets/images/girl.png")}
            className="w-[140px] h-[140px]"
            resizeMode="contain"
          />
        </View>

        {/* Subtitle */}
        <Text className="mt-8 text-[16px] font-bold text-black">
          Read the above written text
        </Text>

        {/* Poem */}
        <View className="mt-3 w-[92%]">
          <Text className="text-[14px] text-center leading-[18px] text-black">
            Twinkle, twinkle, little star,{"\n"}
            Up above, so bright and far,{"\n"}
            Winking softly in the night,{"\n"}
            <Text className="text-blue-600 font-bold">Sprinkling</Text> the sky
            with your light.{"\n"}
            You guide the ships and make them sail,{"\n"}
            Through every storm, wind, and gale.{"\n"}
            With a <Text className="text-blue-600 font-bold">sparkle</Text>, near
            or far,{"\n"}
            You're the brightest little star!
          </Text>
        </View>

        {/* Timer */}
        <View className="mt-5 w-[200px] h-[60px] bg-[#EED9F7] rounded-[10px] items-center justify-center">
          <View className="w-[160px] h-[40px] bg-white rounded-md border border-[#CFA5E3] flex-row items-center justify-center">
            <Text className="text-[18px] font-extrabold text-black">{m}</Text>
            <Text className="text-[18px] font-extrabold text-black"> : </Text>
            <Text className="text-[18px] font-extrabold text-black">{s}</Text>
          </View>
        </View>

        <Text className="mt-3 text-[16px] font-extrabold text-black">
          Time Taken
        </Text>

        {/* Buttons */}
        <View className="flex-row mt-4 space-x-3">
          <TouchableOpacity
            className="bg-black px-6 py-3 rounded-xl"
            onPress={() => setIsRunning((prev) => !prev)}
          >
            <Text className="text-white font-bold">
              {isRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white px-6 py-3 rounded-xl border border-black"
            onPress={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
          >
            <Text className="text-black font-bold">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Finish Button ALWAYS visible */}
        <TouchableOpacity
          className="bg-black px-10 py-3 rounded-xl mt-6"
          onPress={handleFinish}
        >
          <Text className="text-white font-bold">Finish Test</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
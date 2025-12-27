 

// import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function Login() {
//   const router = useRouter();

//   return (
//     <View className="flex-1 bg-[#E6B3F7] px-6 pt-12">
      
//       {/* Back Arrow */}
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={24} color="black" />
//       </TouchableOpacity>

//       {/* App Title */}
//       <Text className="text-3xl text-center font-bold text-black mt-4">
//         Dyslexia Companion
//       </Text>
//       <Text className="text-sm text-center text-gray-700 mb-6">
//         Empowering Every Learner
//       </Text>

//       {/* Fox Image Card */}
//       <View className="  items-center ">
//         <Image
//           source={require("../../assets/images/Fox.png")}
//           className="w-40 h-40"
//           resizeMode="contain"
//         />
//       </View>

//       {/* Login Heading */}
//       <Text className="text-2xl font-bold text-center mb-6">
//         Login
//       </Text>

//       {/* Name Input */}
//       <Text className="text-sm text-black mb-1">Name</Text>
//       <TextInput
//         placeholder=""
//         className="bg-white rounded-full px-5 py-3 mb-4"
//       />

//       {/* Email Input */}
//       <Text className="text-sm text-black mb-1">Email</Text>
//       <TextInput
//         placeholder=""
//         keyboardType="email-address"
//         className="bg-white rounded-full px-5 py-3 mb-4"
//       />

//       {/* Password Input */}
//       <Text className="text-sm text-black mb-1">Password</Text>
//       <TextInput
//         placeholder=""
//         secureTextEntry
//         className="bg-white rounded-full px-5 py-3 mb-6"
//       />

//       {/* Login Button */}
//       <TouchableOpacity className="bg-[#8E44AD] py-3 rounded-full items-center">
//         <Text className="text-white font-semibold text-lg">
//           Log In
//         </Text>
//       </TouchableOpacity>

//       {/* Signup Link */}
//       <View className="flex-row justify-center mt-6">
//         <Text className="text-black text-sm">
//           Don’t having an account?
//         </Text>
//         <TouchableOpacity onPress={() => router.push("/")}>
//           <Text className="text-purple-800 font-semibold text-sm ml-1">
//             Sign Up
//           </Text>
//         </TouchableOpacity>
//       </View>

//     </View>
//   );
// }


// import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
// import { useState } from "react";

// export default function SignUpScreen({ navigation }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignUp = () => {
//     console.log(name, email, password);
//     // connect backend / firebase here
//   };

//   return (
//     <View className="flex-1 bg-purple-300 px-5">
      
//       {/* Header */}
//       <Text className="text-2xl font-bold text-center mt-6">
//         Dyslexia Companion
//       </Text>
//       <Text className="text-xs text-center text-gray-600 mb-4">
//         Empowering Every Learner
//       </Text>

//       {/* Image Card */}
//       <View className="bg-purple-200 rounded-2xl items-center h-36">
//         <Image
//           source={require("../../assets/images/Foxx.png")}
//           className="w-[-10] h-[-10] mt-[-50]"
          
//         />
//       </View>

//       {/* Sign Up */}
//       <Text className="text-lg font-semibold text-center mb-4">
//         Sign Up
//       </Text>

//       {/* Name */}
//       <Text className="text-sm mb-1">Name</Text>
//       <TextInput
//         className="bg-white rounded-full px-4 py-2 mb-3"
//         placeholder="Enter your name"
//         value={name}
//         onChangeText={setName}
//       />

//       {/* Email */}
//       <Text className="text-sm mb-1">Email</Text>
//       <TextInput
//         className="bg-white rounded-full px-4 py-2 mb-3"
//         placeholder="Enter your email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       {/* Password */}
//       <Text className="text-sm mb-1">Password</Text>
//       <TextInput
//         className="bg-white rounded-full px-4 py-2 mb-5"
//         placeholder="Enter your password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       {/* Button */}
//       <TouchableOpacity
//         className="bg-purple-700 py-3 rounded-full items-center"
//         onPress={handleSignUp}
//       >
//         <Text className="text-white font-semibold">Log in</Text>
//       </TouchableOpacity>

//       {/* Login */}
//       <Text className="text-center text-xs mt-5">
//         Already having an account?{" "}
//         <Text
//           className="text-purple-700 font-semibold"
//           onPress={() => navigation.navigate("Login")}
//         >
//           Login
//         </Text>
//       </Text>

//     </View>
//   );
// }



// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function LoginPreview() {
  
//   return (
//     <ScrollView
//       style={{ backgroundColor: "#E6B3F7" }}
//       contentContainerStyle={{
//         paddingHorizontal: 22,
//         paddingTop: 20,
//          // IMPORTANT so nothing hides
//       }}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Back Arrow */}
//       <Ionicons name="arrow-back" size={24} color="black" />

//       {/* App Title */}
//       <Text className="text-3xl text-center font-bold text-black mt-2">
//         Dyslexia Companion
//       </Text>
//       <Text className="text-sm text-center text-gray-700 ">
//         Empowering Every Learner
//       </Text>

//       {/* Fox Card */}
//       <View className="items-center ">
//         <View className=" rounded-3xl ">
//           <Image
//             source={require("../../assets/images/Fox.png")}
//             className="w-40 h-40"
            
//           />
//         </View>
//       </View>

//       {/* Login */}
//       <Text className="text-2xl font-bold text-center -mt-6 ">
//         Login
//       </Text>

//       {/* Name */}
//       <Text className="text-sm text-black mb-1">Name</Text>
//       <TextInput
//         className="bg-white rounded-full px-5 py-3 mb-3"
//       />

//       {/* Email */}
//       <Text className="text-sm text-black mb-1">Email</Text>
//       <TextInput
//         keyboardType="email-address"
//         className="bg-white rounded-full px-5 py-3 mb-3"
//       />

//       {/* Password */}
//       <Text className="text-sm text-black mb-1">Password</Text>
//       <TextInput
//         secureTextEntry
//         className="bg-white rounded-full px-5 py-3 mb-5"
//       />

//       {/* Login Button */}
//       <TouchableOpacity className="bg-[#8E44AD] py-3 rounded-full w-30 items-center">
//         <Text className="text-white font-semibold text-lg">
//           Log In
//         </Text>
//       </TouchableOpacity>

//       {/* Signup */}
//       <View className="flex-row justify-center mt-6">
//         <Text className="text-black text-sm">
//           Don’t have an account?
//         </Text>
//         <Text className="text-purple-800 font-semibold text-sm ml-1">
//           Sign Up
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }


// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import { useRouter } from "expo-router";

// export default function LoginPreview() {
//   const router = useRouter();
//   // 🔹 STATES
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔹 BASIC VALIDATION
//   const validateInputs = () => {
//     if (!name || !email || !password) {
//       Alert.alert("Error", "All fields are required");
//       return false;
//     }

//     if (!email.includes("@")) {
//       Alert.alert("Error", "Enter a valid email");
//       return false;
//     }

//     if (password.length < 6) {
//       Alert.alert("Error", "Password must be at least 6 characters");
//       return false;
//     }

//     return true;
//   };

//   // 🔹 LOGIN HANDLER (BACKEND READY)
//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     setLoading(true);

//     try {
//       const response = await fetch("https://YOUR_BACKEND_URL/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         Alert.alert("Login Failed", data.message || "Something went wrong");
//         setLoading(false);
//         return;
//       }

//       // ✅ SUCCESS (Later you can store token)
//       // Example:
//       // await AsyncStorage.setItem("token", data.token);

//       Alert.alert("Success", "Login successful!");
//     } catch (error) {
//       Alert.alert("Error", "Unable to connect to server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       style={{ backgroundColor: "#E6B3F7" }}
//       contentContainerStyle={{
//         paddingHorizontal: 22,
//         paddingTop: 20,
        
//       }}
//       showsVerticalScrollIndicator={false}
//       keyboardShouldPersistTaps="handled"
//     >
//       {/* Back Arrow */}
//       <TouchableOpacity onPress={() => router.back()}>
//       <Ionicons name="arrow-back" size={24} color="black" />
//       </TouchableOpacity>

//       {/* App Title */}
//       <Text className="text-3xl text-center font-bold text-black mt-2">
//         Dyslexia Companion
//       </Text>
//       <Text className="text-sm text-center text-gray-700">
//         Empowering Every Learner
//       </Text>

//       {/* Fox */}
//       <View className="items-center ">
//         <Image
//           source={require("../../assets/images/Fox.png")}
//           className="w-40 h-40"
//         />
//       </View>

//       {/* Login */}
//       <Text className="text-3xl font-semibold text-center -mt-6 ">
//         Login
//       </Text>

//       {/* Name */}
//       <Text className="text-sm mb-1">Name</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         className="bg-white rounded-full px-5 py-3 mb-3"
//         placeholder="Enter your name"
//       />

//       {/* Email */}
//       <Text className="text-sm mb-1">Email</Text>
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         className="bg-white rounded-full px-5 py-3 mb-3"
//         placeholder="Enter your email"
//       />

//       {/* Password */}
//       <Text className="text-sm mb-1">Password</Text>
//       <TextInput
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         className="bg-white rounded-full px-5 py-3 mb-5"
//         placeholder="Enter your password"
//       />

//       {/* Login Button */}
//       <View className="items-center mt-2">
//       <TouchableOpacity
        
//         onPress={handleLogin}
//         disabled={loading}
//         className="bg-[#8E44AD] w-[200px]  py-3 rounded-full items-center"
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white  font-semibold text-lg">
//             Log In
//           </Text>
//         )}
//       </TouchableOpacity>
//       </View>

//       {/* Signup */}
//       <View className="flex-row justify-center mt-4">
//         <Text className="text-black text-sm">
//           Don’t have an account?
//         </Text>
//         <TouchableOpacity onPress={() => router.push("/signup")}>
//         <Text className="text-purple-800 font-semibold text-sm ml-1">
//           Sign Up
//         </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

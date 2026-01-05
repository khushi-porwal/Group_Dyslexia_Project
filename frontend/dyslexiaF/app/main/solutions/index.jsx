// import { View, Text, TouchableOpacity, Image } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function WelcomeScreen() {
//   const router = useRouter();

//   return (
//     <View className="flex-1 bg-[#E6B3F7] items-center justify-center px-6">

//       {/* Character Card */}
//       <View className="bg-purple-200 rounded-2xl items-center  h-40">
//         <Image
//           source={require("../assets/images/sqirrel.png")}
//           className="mt-[-90]"
//           resizeMode="contain"
//         />
//       </View>

//       {/* Login */}
//       <View className="mt-12 w-[200]"> 
//         <TouchableOpacity
//         onPress={() => router.push("./authentication/login")}
//         className="bg-[#7D3C98] w-full py-3 rounded-full items-center mb-4"
//       >
//         <Text className="text-white font-semibold text-lg">Login</Text>
//       </TouchableOpacity>

//       {/* Sign Up */}
//       <TouchableOpacity
//         onPress={() => router.push("./authentication/signup")}
//         className="bg-[#7D3C98] w-full py-3 rounded-full items-center mb-6"
//       >
//         <Text className="text-white font-semibold text-lg">Sign Up</Text>
//       </TouchableOpacity>
//       </View>
      

//       {/* Social */}
//       <Text className="text-sm text-black mb-4">Or continue with</Text>

//       <View className="flex-row space-x-6">
//         <Ionicons name="logo-facebook" size={26} color="#1877F2" />
//         <Ionicons name="logo-google" size={26} color="#DB4437" />
//         <Ionicons name="logo-instagram" size={26} color="#C13584" />
//       </View>
//     </View>
//   );
// }












//home dashboard
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9D976] px-5 pt-10">
      
      {/* Top Icons */}
      <View className="flex-row justify-between ">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Owl / Mascot */}
      <View className="items-center -mt-8 -mb-4 ">
        <View >
          <Image
            source={require("../../../assets/images/owl.png")}
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Buttons Section */}
      <View className=" space-y-8">

        {/* Reading Assistant */}
        <TouchableOpacity
          className="bg-white rounded-2xl flex-row items-center px-6 py-5"
          onPress={() => router.push("/assistants/reading")}
        >
          <MaterialCommunityIcons name="book-open-page-variant" size={28} color="#7D3C98" />
          <View className="h-8 w-[1px] bg-purple-700 mx-3" />
          <Text className="text-lg font-semibold text-black">Reading Assistant</Text>
        </TouchableOpacity>

        {/* Writing Assistant */}
        <TouchableOpacity
          className="bg-white rounded-2xl flex-row items-center px-6 py-5"
          onPress={() => router.push("/assistants/writing")}
        >
          <Ionicons name="create-outline" size={28} color="#7D3C98" />
          <View className="h-8 w-[1px] bg-purple-700 mx-3" />
          <Text className="text-lg font-semibold text-black">Writing Assistant</Text>
        </TouchableOpacity>

        {/* Sequencing Assistant */}
        <TouchableOpacity
          className="bg-white rounded-2xl flex-row items-center px-6 py-5"
          onPress={() => router.push("/assistants/sequencing")}
        >
          <MaterialCommunityIcons name="view-dashboard-outline" size={28} color="#7D3C98" />
          <View className="h-8 w-[1px] bg-purple-700 mx-3" />
          <Text className="text-lg font-semibold text-black">Sequencing Assistant</Text>
        </TouchableOpacity>

        {/* Gamified Assistant */}
        <TouchableOpacity
          className="bg-white rounded-2xl flex-row items-center px-6 py-5"
          onPress={() => router.push("/assistants/games")}
        >
          <FontAwesome5 name="gamepad" size={24} color="#7D3C98" />
          <View className="h-8 w-[1px] bg-purple-700 mx-3" />
          <Text className="text-lg font-semibold text-black">Gamified Assistant</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
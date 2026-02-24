// import { View, Text, ScrollView } from "react-native";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function History() {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/history")
//       .then(res => setHistory(res.data));
//   }, []);

//   return (
//     <ScrollView className="flex-1 bg-white px-4 pt-6">
//       <Text className="text-2xl font-bold mb-4">Test History</Text>

//       {history.map((item, index) => (
//         <View key={index} className="border rounded-xl p-4 mb-3">
//           <Text className="font-semibold">{item.testType}</Text>
//           <Text>Score: {item.score}/{item.total}</Text>
//           <Text className="text-gray-500">
//             {new Date(item.date).toDateString()}
//           </Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

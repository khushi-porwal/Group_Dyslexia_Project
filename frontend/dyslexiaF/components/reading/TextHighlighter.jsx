import { Text } from "react-native";

export default function TextHighlighter({ text, mistakes }) {
  if (!text) return null;

  const words = text.split(" ");

  return (
    <Text className="text-lg mt-3">
      {words.map((word, index) => {
        const isMistake = mistakes.includes(word);

        return (
          <Text
            key={index}
            className={isMistake ? "text-red-500 font-bold" : ""}
          >
            {word + " "}
          </Text>
        );
      })}
    </Text>
  );
}
import { Text } from "react-native";

export default function TextHighlighter({ text = "", mistakes = [] }) {
  if (!text?.trim()) return null;

  const words = text.trim().split(/\s+/);

  const mistakeIndexSet = new Set();
  const mistakeWordSet = new Set();

  mistakes.forEach((item) => {
    if (typeof item === "string") {
      mistakeWordSet.add(item.toLowerCase());
      return;
    }

    if (typeof item === "object" && item !== null) {
      if (Number.isInteger(item.index)) mistakeIndexSet.add(item.index);
      if (item.actual) mistakeWordSet.add(item.actual.toLowerCase());
      if (item.expected) mistakeWordSet.add(item.expected.toLowerCase());
    }
  });

  return (
    <Text className="text-lg mt-3 leading-7">
      {words.map((word, index) => {
        const normalized = word.toLowerCase().replace(/[^a-z0-9']/gi, "");
        const isMistake =
          mistakeIndexSet.has(index) || mistakeWordSet.has(normalized);

        return (
          <Text
            key={index}
            className={isMistake ? "text-rose-600 font-semibold underline" : ""}
          >
            {word + " "}
          </Text>
        );
      })}
    </Text>
  );
}

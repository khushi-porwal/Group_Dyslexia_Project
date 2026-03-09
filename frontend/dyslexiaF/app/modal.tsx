import { useLocalSearchParams } from "expo-router";
import ReadingBottomSheet from "../components/reading/ReadingBottomSheet";

export default function ModalScreen() {
  const { type } = useLocalSearchParams();

  return <ReadingBottomSheet type={type} />;
}
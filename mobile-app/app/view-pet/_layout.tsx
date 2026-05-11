import { Stack } from "expo-router";

export default function ViewPetLayout() {
  return (
    <Stack screenOptions={{ title: "My pet", animation: "slide_from_right" }} />
  );
}

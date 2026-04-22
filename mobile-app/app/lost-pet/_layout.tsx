import { Stack } from "expo-router";

import { LostPetFlowProvider } from "@/contexts/LostPetFlowContext";

export default function LostPetLayout() {
  return (
    <LostPetFlowProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      />
    </LostPetFlowProvider>
  );
}

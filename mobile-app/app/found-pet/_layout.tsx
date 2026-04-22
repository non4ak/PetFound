import { Stack } from "expo-router";

import { FoundPetFlowProvider } from "@/contexts/FoundPetFlowContext";

export default function FoundPetLayout() {
  return (
    <FoundPetFlowProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      />
    </FoundPetFlowProvider>
  );
}

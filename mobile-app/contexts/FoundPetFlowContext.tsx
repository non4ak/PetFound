import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  FoundPetDetails,
  FoundPetInfo,
} from "@/types/found-pet";
import { formatCurrentAnnouncementDate } from "@/utils/announcementDate";

interface FoundPetFlowContextValue {
  details: FoundPetDetails;
  info: FoundPetInfo;
  photoUri: string | null;
  resetDraft: () => void;
  setPhotoUri: (uri: string | null) => void;
  updateDetails: (nextDetails: FoundPetDetails) => void;
  updateInfo: (nextInfo: FoundPetInfo) => void;
}

function createInitialInfo(): FoundPetInfo {
  return {
    breed: "",
    chipNumber: "",
    hasMicrochip: false,
    petAgeCategory: null,
    petSex: null,
    petSize: null,
    petType: null,
  };
}

function createInitialDetails(): FoundPetDetails {
  return {
    city: "Kharkiv",
    country: "Ukraine",
    dateLastSeen: formatCurrentAnnouncementDate(),
    description: "",
    showPhone: true,
    showTelegram: true,
    timeApproximate: "",
  };
}

const FoundPetFlowContext =
  createContext<FoundPetFlowContextValue | null>(null);

export function FoundPetFlowProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<FoundPetInfo>(createInitialInfo());
  const [details, setDetails] = useState<FoundPetDetails>(
    createInitialDetails()
  );
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const resetDraft = (): void => {
    setInfo(createInitialInfo());
    setDetails(createInitialDetails());
    setPhotoUri(null);
  };

  const value: FoundPetFlowContextValue = {
    details,
    info,
    photoUri,
    resetDraft,
    setPhotoUri,
    updateDetails: setDetails,
    updateInfo: setInfo,
  };

  return (
    <FoundPetFlowContext.Provider value={value}>
      {children}
    </FoundPetFlowContext.Provider>
  );
}

export function useFoundPetFlow(): FoundPetFlowContextValue {
  const context: FoundPetFlowContextValue | null =
    useContext(FoundPetFlowContext);

  if (context === null) {
    throw new Error(
      "useFoundPetFlow must be used within a FoundPetFlowProvider"
    );
  }

  return context;
}

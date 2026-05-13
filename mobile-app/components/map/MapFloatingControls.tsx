import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { mapStyles } from "./map.styles";
import type {
  FloatingMapActionData,
  MapFloatingActionId,
} from "../../types/map.types";

interface MapFloatingControlsProps {
  actions: readonly FloatingMapActionData[];
  bottomInset: number;
  onActionPress: (actionId: MapFloatingActionId) => void;
  tabBarOffset: number;
}

export function MapFloatingControls({
  actions,
  bottomInset,
  onActionPress,
  tabBarOffset,
}: MapFloatingControlsProps): React.JSX.Element {
  return (
    <View
      className="absolute right-4 gap-3"
      pointerEvents="box-none"
      style={{ bottom: bottomInset + tabBarOffset }}
    >
      {actions.map((action: FloatingMapActionData) => (
        <TouchableOpacity
          accessibilityLabel={action.accessibilityLabel}
          activeOpacity={0.85}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
          key={action.id}
          onPress={() => onActionPress(action.id)}
          style={mapStyles.floatingActionButton}
        >
          <MaterialIcons color="#000" name={action.iconName} size={24} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

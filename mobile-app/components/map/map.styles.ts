import { StyleSheet } from "react-native";

export const mapStyles = StyleSheet.create({
  floatingActionButton: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  filterChip: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBar: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userLocationDot: {
    borderColor: "#FFFFFF",
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    width: 14,
  },
  userLocationPulse: {
    alignItems: "center",
    backgroundColor: "#4285F433",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});

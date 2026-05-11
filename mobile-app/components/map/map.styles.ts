import { StyleSheet } from "react-native";

export const mapStyles = StyleSheet.create({
  floatingActionButton: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
***REMOVED***,
  filterChip: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
***REMOVED***,
  searchBar: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
***REMOVED***,
  userLocationDot: {
    borderColor: "#FFFFFF",
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    width: 14,
***REMOVED***,
  userLocationPulse: {
    alignItems: "center",
    backgroundColor: "#4285F433",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
***REMOVED***,
});

export const MARKER_SIZE: number = 36;
export const MARKER_BORDER: number = 3;
export const MARKER_IMAGE_SIZE: number = MARKER_SIZE - MARKER_BORDER * 2;

export const petMarkerStyles = StyleSheet.create({
  callout: {
    padding: 8,
    width: 180,
***REMOVED***,
  calloutDate: {
    color: "#8D8D8D",
    fontSize: 12,
***REMOVED***,
  calloutDays: {
    color: "#8D8D8D",
    fontSize: 12,
    marginTop: 1,
***REMOVED***,
  calloutName: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
***REMOVED***,
  calloutStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
***REMOVED***,
  image: {
    borderRadius: MARKER_IMAGE_SIZE / 2,
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
***REMOVED***,
  imageWrap: {
    alignItems: "center",
    borderRadius: MARKER_SIZE / 2,
    borderWidth: MARKER_BORDER,
    height: MARKER_SIZE,
    justifyContent: "center",
    overflow: "hidden",
    width: MARKER_SIZE,
***REMOVED***,
});
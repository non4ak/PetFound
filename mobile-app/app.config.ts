import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Pet Found",
  slug: "pet-found",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "petfound",
  splash: {
    image: "./assets/images/splash-logo.png",
    resizeMode: "contain",
    backgroundColor: "#FFF5E2",
***REMOVED***,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  ***REMOVED***,
***REMOVED***,
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
  ***REMOVED***,
    edgeToEdgeEnabled: true,
    googleServicesFile: "./google-services.json",
    package: "com.petfound.app",
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "POST_NOTIFICATIONS"],
    softwareKeyboardLayoutMode: "pan",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    ***REMOVED***,
  ***REMOVED***,
***REMOVED***,
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
***REMOVED***,
  plugins: [
    "expo-router",
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Allow Pet Found to show your location on the map.",
    ***REMOVED***,
    ],
    [
      "expo-image-picker",
      {
        cameraPermission: "Allow LostPet to take pet photos with your camera.",
        photosPermission:
          "Allow LostPet to choose pet photos from your gallery.",
    ***REMOVED***,
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-logo.png",
        imageWidth: 128,
        resizeMode: "contain",
        backgroundColor: "#FFF5E2",
        dark: {
          backgroundColor: "#FFF5E2",
      ***REMOVED***,
    ***REMOVED***,
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
***REMOVED***,
});

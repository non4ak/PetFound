import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "mobile-app",
    slug: "mobile-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobileapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
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
        package: "com.anonymous.mobileapp",
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
        [
            "expo-image-picker",
            {
                cameraPermission: "Allow LostPet to take pet photos with your camera.",
                photosPermission: "Allow LostPet to choose pet photos from your gallery.",
          ***REMOVED***,
        ],
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
                dark: {
                    backgroundColor: "#000000",
              ***REMOVED***,
          ***REMOVED***,
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
  ***REMOVED***,
});

import { ExpoConfig, ConfigContext } from "expo/config";

import withAndroidPushNotifications from "./plugins/withAndroidPushNotifications";

export default ({ config }: ConfigContext): ExpoConfig =>
  withAndroidPushNotifications({
    ...config,
    name: "Pet Found",
    slug: "pet-found",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.jpg",
    scheme: "petfound",
    splash: {
      image: "./assets/images/splash-logo.png",
      resizeMode: "contain",
      backgroundColor: "#FFF5E2",
    },
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/mobile-logo.png",
        monochromeImage: "./assets/images/mobile-logo.png",
      },
      edgeToEdgeEnabled: true,
      googleServicesFile: "./google-services.json",
      package: "com.petfound.app",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "POST_NOTIFICATIONS",
      ],
      softwareKeyboardLayoutMode: "pan",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo.jpg",
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Allow Pet Found to show your location on the map.",
        },
      ],
      [
        "expo-image-picker",
        {
          cameraPermission:
            "Allow LostPet to take pet photos with your camera.",
          photosPermission:
            "Allow LostPet to choose pet photos from your gallery.",
        },
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
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  });

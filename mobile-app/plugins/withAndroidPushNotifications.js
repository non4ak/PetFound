// @ts-check

const { promises: fs } = require("node:fs");
const path = require("node:path");
const {
  AndroidConfig,
  withAndroidColors,
  withAndroidManifest,
  withDangerousMod,
  withProjectBuildGradle,
} = require("expo/config-plugins");

const NOTIFICATION_COLOR = "#D89F35";
const NOTIFICATION_COLOR_NAME = "notification_icon_color";
const NOTIFICATION_ICON_NAME = "ic_notification";
const NOTIFICATION_ICON_SOURCE = "assets/images/notification-icon.png";
const NOTIFEE_MAVEN_REPOSITORY =
  'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';
const FIREBASE_NOTIFICATION_ICON =
  "com.google.firebase.messaging.default_notification_icon";
const FIREBASE_NOTIFICATION_COLOR =
  "com.google.firebase.messaging.default_notification_color";

/**
 * @param {string} buildGradle
 * @returns {string}
 */
function addNotifeeMavenRepository(buildGradle) {
  if (buildGradle.includes(NOTIFEE_MAVEN_REPOSITORY)) {
    return buildGradle;
***REMOVED***

  const allProjectsRepositoriesPattern =
    /(allprojects\s*\{\s*repositories\s*\{\s*google\(\)\s*mavenCentral\(\))/;

  if (!allProjectsRepositoriesPattern.test(buildGradle)) {
    throw new Error(
      "Could not add the Notifee Maven repository to android/build.gradle.",
    );
***REMOVED***

  return buildGradle.replace(
    allProjectsRepositoriesPattern,
    `$1\n    ${NOTIFEE_MAVEN_REPOSITORY}`,
  );
}

/** @type {import("expo/config-plugins").ConfigPlugin} */
const withAndroidPushNotifications = (config) => {
  let nextConfig = withAndroidManifest(config, (manifestConfig) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      manifestConfig.modResults,
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      FIREBASE_NOTIFICATION_ICON,
      `@drawable/${NOTIFICATION_ICON_NAME}`,
      "resource",
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      FIREBASE_NOTIFICATION_COLOR,
      `@color/${NOTIFICATION_COLOR_NAME}`,
      "resource",
    );

    const colorMetadata = mainApplication["meta-data"]?.find(
      (item) => item.$["android:name"] === FIREBASE_NOTIFICATION_COLOR,
    );

    if (colorMetadata === undefined) {
      throw new Error(
        "Could not configure the Firebase notification color metadata.",
      );
  ***REMOVED***

    colorMetadata.$["tools:replace"] = "android:resource";
    manifestConfig.modResults.manifest.$["xmlns:tools"] =
      "http://schemas.android.com/tools";

    return manifestConfig;
***REMOVED***);

  nextConfig = withAndroidColors(nextConfig, (colorsConfig) => {
    colorsConfig.modResults = AndroidConfig.Colors.assignColorValue(
      colorsConfig.modResults,
      {
        name: NOTIFICATION_COLOR_NAME,
        value: NOTIFICATION_COLOR,
    ***REMOVED***,
    );
    return colorsConfig;
***REMOVED***);

  nextConfig = withDangerousMod(nextConfig, [
    "android",
    async (iconConfig) => {
      const sourcePath = path.join(
        iconConfig.modRequest.projectRoot,
        NOTIFICATION_ICON_SOURCE,
      );
      const destinationDirectory = path.join(
        iconConfig.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "drawable",
      );
      const destinationPath = path.join(
        destinationDirectory,
        `${NOTIFICATION_ICON_NAME}.png`,
      );

      await fs.mkdir(destinationDirectory, { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
      return iconConfig;
  ***REMOVED***,
  ]);

  nextConfig = withProjectBuildGradle(nextConfig, (gradleConfig) => {
    if (gradleConfig.modResults.language !== "groovy") {
      throw new Error(
        "Notifee Maven repository configuration requires a Groovy build.gradle file.",
      );
  ***REMOVED***

    gradleConfig.modResults.contents = addNotifeeMavenRepository(
      gradleConfig.modResults.contents,
    );
    return gradleConfig;
***REMOVED***);

  return nextConfig;
};

module.exports = withAndroidPushNotifications;

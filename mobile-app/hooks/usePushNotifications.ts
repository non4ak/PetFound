import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import messaging, {
  type RemoteMessage,
} from "@react-native-firebase/messaging";
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  type Event,
  type InitialNotification,
  type Notification,
  type NotificationSettings,
} from "@notifee/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { updateDeviceKeyQuery } from "@/data/queries/auth";
import type { ForegroundMatchNotification } from "@/types/pushNotification";

const DEFAULT_MATCH_TITLE = "Possible match found";
const DEFAULT_MATCH_BODY = "We found an announcement that may match your pet.";
const MATCH_NOTIFICATION_CHANNEL_ID = "possible-matches-v2";
const DEFAULT_PRESS_ACTION_ID = "default";
const DEVICE_KEY_UPDATE_ATTEMPTS = 3;
const DEVICE_KEY_RETRY_DELAY_MS = 1000;

interface PushNotificationsState {
  token: string | null;
}

type DeviceKeyUpdateResult = "updated" | "endpoint-unavailable";

function wait(durationInMilliseconds: number): Promise<void> {
  return new Promise((resolve: () => void): void => {
    setTimeout(resolve, durationInMilliseconds);
***REMOVED***);
}

function isRetryableDeviceKeyError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return true;
***REMOVED***

  const statusCode: number | undefined = error.response?.status;
  return (
    statusCode === undefined ||
    statusCode === 408 ||
    statusCode === 429 ||
    statusCode >= 500
  );
}

async function updateDeviceKeyWithRetry(
  deviceKey: string,
): Promise<DeviceKeyUpdateResult> {
  let lastError: unknown = new Error("Device key update did not start.");

  for (
    let attemptNumber: number = 1;
    attemptNumber <= DEVICE_KEY_UPDATE_ATTEMPTS;
    attemptNumber += 1
  ) {
    try {
      await updateDeviceKeyQuery({ deviceKey });
      return "updated";
  ***REMOVED*** catch (error: unknown) {
      lastError = error;
      const statusCode: number | undefined = isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (statusCode === 404) {
        console.info(
          "Device key endpoint is not available in the current backend deployment.",
          {
            deviceKeyLength: deviceKey.length,
            statusCode,
        ***REMOVED***,
        );
        return "endpoint-unavailable";
    ***REMOVED***

      console.warn("Failed to update the push notification device key.", {
        attemptNumber,
        deviceKeyLength: deviceKey.length,
        responseBody: isAxiosError(error) ? error.response?.data : undefined,
        statusCode,
    ***REMOVED***);

      if (!isRetryableDeviceKeyError(error)) {
        break;
    ***REMOVED***

      if (attemptNumber < DEVICE_KEY_UPDATE_ATTEMPTS) {
        await wait(DEVICE_KEY_RETRY_DELAY_MS);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

  if (lastError instanceof Error) {
    throw lastError;
***REMOVED***

  throw new Error("Failed to update the push notification device key.");
}

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
***REMOVED***

  const parsedValue: number = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
***REMOVED***

  return parsedValue;
}

function parseMatchData(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
***REMOVED***

  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
***REMOVED***

  try {
    const parsedValue: unknown = JSON.parse(value);
    return typeof parsedValue === "object" && parsedValue !== null
      ? (parsedValue as Record<string, unknown>)
      : null;
***REMOVED*** catch (error: unknown) {
    console.warn("Invalid match data in push notification.", {
      error,
      value,
  ***REMOVED***);
    return null;
***REMOVED***
}

function isMatchFoundType(value: unknown): boolean {
  if (typeof value === "number") {
    return value === 1;
***REMOVED***

  if (typeof value !== "string") {
    return false;
***REMOVED***

  const normalizedValue: string = value
    .trim()
    .toLowerCase()
    .replaceAll("_", "")
    .replaceAll("-", "");

  return normalizedValue === "1" || normalizedValue === "matchfound";
}

function getAnnouncementIdFromData(
  data: Record<string, unknown>,
  messageType: string | undefined,
): number | null {
  const matchData: Record<string, unknown> | null = parseMatchData(data.match);
  const oppositeAnnouncementCandidates: unknown[] = [
    data.oppositeAnnouncementId,
    matchData?.oppositeAnnouncementId,
  ];

  for (const candidate of oppositeAnnouncementCandidates) {
    const announcementId: number | null = parsePositiveInteger(candidate);
    if (announcementId !== null) {
      return announcementId;
  ***REMOVED***
***REMOVED***

  const isMatchFound: boolean = [
    data.type,
    data.notificationType,
    data.typeLabel,
    messageType,
  ].some(isMatchFoundType);

  if (!isMatchFound && matchData === null) {
    return null;
***REMOVED***

  const announcementCandidates: unknown[] = [
    data.announcementId,
    matchData?.announcementId,
  ];

  for (const candidate of announcementCandidates) {
    const announcementId: number | null = parsePositiveInteger(candidate);
    if (announcementId !== null) {
      return announcementId;
  ***REMOVED***
***REMOVED***

  return null;
}

function getRemoteAnnouncementId(remoteMessage: RemoteMessage): number | null {
  return getAnnouncementIdFromData(
    remoteMessage.data ?? {},
    remoteMessage.messageType,
  );
}

function mapRemoteMessage(
  remoteMessage: RemoteMessage,
): ForegroundMatchNotification {
  const announcementId: number | null = getRemoteAnnouncementId(remoteMessage);

  return {
    announcementId,
    body: remoteMessage.notification?.body?.trim() || DEFAULT_MATCH_BODY,
    id:
      remoteMessage.messageId ??
      `${announcementId}-${remoteMessage.sentTime ?? Date.now()}`,
    title: remoteMessage.notification?.title?.trim() || DEFAULT_MATCH_TITLE,
***REMOVED***;
}

function getNotifeeAnnouncementId(notification: Notification): number | null {
  return getAnnouncementIdFromData(notification.data ?? {}, undefined);
}

async function displayMatchNotification(
  notification: ForegroundMatchNotification,
): Promise<void> {
  const channelId: string = await notifee.createChannel({
    id: MATCH_NOTIFICATION_CHANNEL_ID,
    importance: AndroidImportance.HIGH,
    name: "Possible matches",
    sound: "default",
    visibility: AndroidVisibility.PUBLIC,
***REMOVED***);

  const data: Record<string, string> =
    notification.announcementId === null
      ? {}
      : { announcementId: String(notification.announcementId) };

  await notifee.displayNotification({
    android: {
      channelId,
      pressAction: {
        id: DEFAULT_PRESS_ACTION_ID,
    ***REMOVED***,
      sound: "default",
      visibility: AndroidVisibility.PUBLIC,
  ***REMOVED***,
    body: notification.body,
    data,
    id: notification.id,
    ios: {
      foregroundPresentationOptions: {
        banner: true,
        list: true,
        sound: true,
    ***REMOVED***,
  ***REMOVED***,
    title: notification.title,
***REMOVED***);
}

export function usePushNotifications(): PushNotificationsState {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const openMatches = useCallback((): void => {
    router.dismissTo({
      pathname: "/(tabs)/alerts",
      params: { view: "matches" },
  ***REMOVED***);
***REMOVED***, [router]);

  const openAnnouncement = useCallback(
    (announcementId: number): void => {
      openMatches();
      InteractionManager.runAfterInteractions((): void => {
        router.push({
          pathname: "/pet/[id]",
          params: { id: String(announcementId) },
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***,
    [openMatches, router],
  );

  const openNotifeeNotification = useCallback(
    (notification: Notification | undefined): void => {
      if (notification === undefined) {
        return;
    ***REMOVED***

      const announcementId: number | null =
        getNotifeeAnnouncementId(notification);

      if (announcementId === null) {
        openMatches();
        return;
    ***REMOVED***

      openAnnouncement(announcementId);
  ***REMOVED***,
    [openAnnouncement, openMatches],
  );

  const handleNotifeeEvent = useCallback(
    (event: Event): void => {
      if (
        event.type !== EventType.PRESS &&
        event.type !== EventType.ACTION_PRESS
      ) {
        return;
    ***REMOVED***

      openNotifeeNotification(event.detail.notification);
  ***REMOVED***,
    [openNotifeeNotification],
  );

  useEffect(() => {
    async function initializeMessaging(): Promise<void> {
      const settings: NotificationSettings = await notifee.requestPermission();
      const isAuthorized: boolean =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

      if (!isAuthorized) {
        return;
    ***REMOVED***

      const nextToken: string = await messaging().getToken();
      setToken(nextToken);
  ***REMOVED***

    void initializeMessaging().catch((error: unknown) => {
      console.warn("Failed to initialize push notifications.", { error });
  ***REMOVED***);
***REMOVED***, []);

  useEffect(() => {
    return messaging().onTokenRefresh((nextToken: string): void => {
      setToken(nextToken);
  ***REMOVED***);
***REMOVED***, []);

  useEffect(() => {
    if (!isAuthenticated || token === null) {
      return;
  ***REMOVED***

    void updateDeviceKeyWithRetry(token).catch((error: unknown) => {
      console.error("Could not persist the push notification device key.", {
        error,
        deviceKeyLength: token.length,
    ***REMOVED***);
  ***REMOVED***);
***REMOVED***, [isAuthenticated, token]);

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      (remoteMessage: RemoteMessage): void => {
        const notification: ForegroundMatchNotification =
          mapRemoteMessage(remoteMessage);

        void displayMatchNotification(notification).catch((error: unknown) => {
          console.warn("Failed to display foreground match notification.", {
            error,
            messageId: remoteMessage.messageId,
        ***REMOVED***);
      ***REMOVED***);
        void queryClient.invalidateQueries({ queryKey: ["alerts"] });
        void queryClient.invalidateQueries({ queryKey: ["matches"] });
    ***REMOVED***,
    );
    return () => {
      unsubscribeForeground();
  ***REMOVED***;
***REMOVED***, [queryClient]);

  useEffect(() => {
    const unsubscribeNotifee = notifee.onForegroundEvent(handleNotifeeEvent);

    void notifee
      .getInitialNotification()
      .then((initialNotification: InitialNotification | null): void => {
        if (initialNotification !== null) {
          openNotifeeNotification(initialNotification.notification);
      ***REMOVED***
    ***REMOVED***)
      .catch((error: unknown) => {
        console.warn("Failed to read the initial Notifee notification.", {
          error,
      ***REMOVED***);
    ***REMOVED***);

    return unsubscribeNotifee;
***REMOVED***, [handleNotifeeEvent, openNotifeeNotification]);

  return {
    token,
***REMOVED***;
}

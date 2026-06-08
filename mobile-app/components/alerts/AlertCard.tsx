import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { NotificationType, type Notification } from "@/types/alerts";

interface AlertCardProps {
  item: Notification;
  onPress: (() => void) | undefined;
}

interface AlertStyle {
  backgroundColor: string;
  iconColor: string;
  iconName: "chatbubble-outline" | "git-compare-outline" | "warning-outline";
}

const ALERT_STYLES: Record<NotificationType, AlertStyle> = {
  [NotificationType.NewComment]: {
    backgroundColor: "#FFF8E1",
    iconColor: "#9A6A00",
    iconName: "chatbubble-outline",
***REMOVED***,
  [NotificationType.MatchFound]: {
    backgroundColor: "#F1F3FF",
    iconColor: "#5330FF",
    iconName: "git-compare-outline",
***REMOVED***,
  [NotificationType.PhotoProcessingFailed]: {
    backgroundColor: "#FFF1F2",
    iconColor: "#D95068",
    iconName: "warning-outline",
***REMOVED***,
};

function getAlertTitle(item: Notification): string {
  const title: string = item.typeLabel.trim();
  return title || "Notification";
}

function getAlertDetails(item: Notification): string {
  return item.message.trim() || "No additional details";
}

function formatReceivedAt(value: string): string {
  const receivedAt: Date = new Date(value);

  if (Number.isNaN(receivedAt.getTime())) {
    return "Received time unavailable";
***REMOVED***

  const date: string = receivedAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
***REMOVED***);
  const time: string = receivedAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
***REMOVED***);

  return `Received ${date}, ${time}`;
}

export function AlertCard({ item, onPress }: AlertCardProps) {
  const alertStyle: AlertStyle =
    ALERT_STYLES[item.type] ?? ALERT_STYLES[NotificationType.NewComment];
  const details: string = getAlertDetails(item);
  const isInteractive: boolean = onPress !== undefined;

  return (
    <TouchableOpacity
      activeOpacity={isInteractive ? 0.75 : 1}
      className={"mb-2 flex-row items-center rounded-[16px] bg-white px-4 py-3"}
      disabled={!isInteractive}
      onPress={onPress}
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: alertStyle.backgroundColor }}
      >
        <Ionicons color={alertStyle.iconColor} name="notifications" size={21} />
      </View>

      <View className="flex-1">
        <Typography
          className="font-semibold text-heading-text"
          numberOfLines={1}
          variant="body-medium"
        >
          {getAlertTitle(item)}
        </Typography>

        {details.length > 0 ? (
          <Typography
            className="text-secondary-text"
            numberOfLines={1}
            variant="body-small"
          >
            {details}
          </Typography>
        ) : null}

        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="time-outline" size={14} color="#8D8D8D" />
          <Typography
            className="text-[14px] text-secondary-text"
            variant="body-small"
          >
            {formatReceivedAt(item.createdOn)}
          </Typography>
        </View>
      </View>

      {isInteractive ? (
        <Ionicons name="chevron-forward" size={18} color="#B5B5B5" />
      ) : null}
    </TouchableOpacity>
  );
}

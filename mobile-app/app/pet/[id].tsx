import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { PreviewBadge } from "@/components/announcement/PreviewBadge";
import { Typography } from "@/components/ui/Typography";
import {
  useArchiveAnnouncement,
  useGetAnnouncementById,
  useRestoreAnnouncement,
} from "@/data/hooks/announcements";
import { useCreateComment, useGetComments } from "@/data/hooks/comments";
import { uploadPhotoFromUriQuery } from "@/data/queries/photos";
import type { Comment } from "@/types/comment";
import {
  getMapTargetCoordinate,
  getMapTargetParams,
  type MapTargetCoordinate,
} from "@/utils/mapTarget";

const STATUS_STYLES = {
  found: {
    backgroundColor: "#D4EDDA",
    label: "FOUND",
    textColor: "#28A745",
***REMOVED***,
  lost: {
    backgroundColor: "#FFDCE1",
    label: "LOST",
    textColor: "#D95068",
***REMOVED***,
};

function getSocialMediaUrl(socialNetwork: string): string {
  const trimmedSocialNetwork: string = socialNetwork.trim();

  if (
    trimmedSocialNetwork.startsWith("https://") ||
    trimmedSocialNetwork.startsWith("http://")
  ) {
    return trimmedSocialNetwork;
***REMOVED***

  return `https://t.me/${trimmedSocialNetwork.replace(/^@/, "")}`;
}

async function openContactUrl(url: string, errorMessage: string): Promise<void> {
  try {
    await Linking.openURL(url);
***REMOVED*** catch (error: unknown) {
    console.warn("Failed to open announcement contact.", {
      error,
      url,
  ***REMOVED***);
    Alert.alert("Could not open contact", errorMessage);
***REMOVED***
}

function flattenComments(
  comments: Comment[],
): { comment: Comment; depth: number }[] {
  const result: { comment: Comment; depth: number }[] = [];
  function traverse(c: Comment, depth: number) {
    result.push({ comment: c, depth });
    c.replies.forEach((r) => traverse(r, depth + 1));
***REMOVED***
  comments.forEach((c) => traverse(c, 0));
  return result;
}

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id, mine } = useLocalSearchParams<{ id: string; mine?: string }>();
  const announcementId = Number(id);
  const isOwner = mine === "1";

  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(
    null,
  );

  const { data: announcementData } = useGetAnnouncementById(announcementId);
  const { data: commentsData, isLoading: isLoadingComments } =
    useGetComments(announcementId);
  const { mutateAsync: postComment, isPending: isPosting } =
    useCreateComment(announcementId);
  const { mutateAsync: archiveAnnouncement, isPending: isArchiving } =
    useArchiveAnnouncement();
  const { mutateAsync: restoreAnnouncement, isPending: isRestoring } =
    useRestoreAnnouncement();

  const announcement = announcementData?.data;
  const petInfo = announcementData?.data?.pet;
  const phoneNumber: string | null =
    announcement?.phoneNumber?.trim() || null;
  const socialNetwork: string | null =
    announcement?.socialNetwork?.trim() || null;

  const flatComments = flattenComments(commentsData?.items ?? []);

  const handleBackPress = (): void => {
    router.back();
***REMOVED***;

  const handleOpenMapPress = (): void => {
    const coordinate: MapTargetCoordinate | null = getMapTargetCoordinate(
      announcement?.lastSeenLatitude,
      announcement?.lastSeenLongitude,
    );

    if (coordinate === null) {
      Alert.alert(
        "Location is not available",
        "This announcement does not have map coordinates.",
      );
      return;
  ***REMOVED***

    router.dismissTo({
      pathname: "/(tabs)/map",
      params: getMapTargetParams(coordinate),
  ***REMOVED***);
***REMOVED***;

  const handleArchivePress = () => {
    Alert.alert(
      "Archive announcement",
      "This will hide your announcement from the feed. You can restore it later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: async () => {
            try {
              await archiveAnnouncement(announcementId);
              router.back();
          ***REMOVED*** catch {
              Alert.alert("Error", "Failed to archive. Please try again.");
          ***REMOVED***
        ***REMOVED***,
      ***REMOVED***,
      ],
    );
***REMOVED***;

  const handleRestorePress = async () => {
    try {
      await restoreAnnouncement(announcementId);
  ***REMOVED*** catch {
      Alert.alert("Error", "Failed to restore. Please try again.");
  ***REMOVED***
***REMOVED***;

  const handlePickImage = () => {
    Alert.alert("Add photo", "Choose how you want to add a photo.", [
      {
        text: "Take photo",
        onPress: async () => {
          const { granted } = await ImagePicker.requestCameraPermissionsAsync();
          if (!granted) {
            Alert.alert(
              "Permission needed",
              "Please allow camera access in your device settings.",
            );
            return;
        ***REMOVED***
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        ***REMOVED***);
          if (!result.canceled) setSelectedImage(result.assets[0]);
      ***REMOVED***,
    ***REMOVED***,
      {
        text: "Choose from gallery",
        onPress: async () => {
          const { granted } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!granted) {
            Alert.alert(
              "Permission needed",
              "Please allow photo library access in your device settings.",
            );
            return;
        ***REMOVED***
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        ***REMOVED***);
          if (!result.canceled) setSelectedImage(result.assets[0]);
      ***REMOVED***,
    ***REMOVED***,
      { text: "Cancel", style: "cancel" },
    ]);
***REMOVED***;

  const handleSubmitComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || isPosting || isUploading) return;

    try {
      setIsUploading(true);

      let imageUrl: string | undefined;
      if (selectedImage) {
        const fileName = selectedImage.uri.split("/").pop() ?? "photo.jpg";
        const contentType = selectedImage.mimeType ?? "image/jpeg";
        imageUrl = await uploadPhotoFromUriQuery({
          uri: selectedImage.uri,
          fileName,
          contentType,
          fileSizeInBytes: selectedImage.fileSize ?? 0,
      ***REMOVED***);
    ***REMOVED***

      await postComment({ commentMessage: trimmed, imageUrl });
      setCommentText("");
      setSelectedImage(null);
  ***REMOVED*** catch {
      Alert.alert("Error", "Failed to post comment. Please try again.");
  ***REMOVED*** finally {
      setIsUploading(false);
  ***REMOVED***
***REMOVED***;

  const isSending = isPosting || isUploading;
  const canSend = commentText.trim().length > 0 && !isSending;

  if (announcementData?.data === null) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF5E2] px-6">
        <TouchableOpacity
          className="mt-4 h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
          onPress={handleBackPress}
        >
          <Ionicons color="#94A3B8" name="arrow-back" size={20} />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <Typography
            className="text-center font-semibold text-heading-text"
            variant="title-small"
          >
            Pet announcement was not found
          </Typography>
        </View>
      </SafeAreaView>
    );
***REMOVED***

  const status =
    STATUS_STYLES[announcement?.petStatus === 0 ? "lost" : "found"];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Modal
        visible={fullScreenImageUrl !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreenImageUrl(null)}
        statusBarTranslucent
      >
        <StatusBar hidden />
        <View className="flex-1 items-center justify-center bg-black">
          <Image
            source={{ uri: fullScreenImageUrl ?? "" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => setFullScreenImageUrl(null)}
            className="absolute right-4 top-12 h-10 w-10 items-center justify-center rounded-full bg-black/50"
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <View className="flex-row items-center justify-between rounded-b-[16px] bg-white px-5 py-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
          onPress={handleBackPress}
        >
          <Ionicons color="#94A3B8" name="arrow-back" size={20} />
        </TouchableOpacity>
        <Typography
          className="font-semibold text-heading-text"
          variant="body-regular"
        >
          Pet
        </Typography>
        {isOwner ? (
          <View className="flex-row items-center gap-2">
            {announcement != null &&
              (announcement.isActive ? (
                <TouchableOpacity
                  onPress={handleArchivePress}
                  disabled={isArchiving || isRestoring}
                  className="h-9 items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white px-3"
                >
                  {isArchiving ? (
                    <ActivityIndicator size="small" color="#94A3B8" />
                  ) : (
                    <Typography
                      variant="body-small"
                      className="text-secondary-text"
                    >
                      Archive
                    </Typography>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleRestorePress}
                  disabled={isArchiving || isRestoring}
                  className="h-9 items-center justify-center rounded-[8px] border border-primary bg-white px-3"
                >
                  {isRestoring ? (
                    <ActivityIndicator size="small" color="#D89F35" />
                  ) : (
                    <Typography
                      variant="body-small"
                      className="font-semibold text-primary"
                    >
                      Restore
                    </Typography>
                  )}
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/my-announcements/[id]/edit",
                  params: { id: announcementId },
              ***REMOVED***)
            ***REMOVED***
              className="h-9 items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white px-3"
            >
              <Typography variant="body-small" className="text-heading-text">
                Edit
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-4 "
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-3 bg-white px-6 pb-5 pt-3">
            <Image
              className="h-[180px] w-full rounded-[8px]"
              resizeMode="cover"
              source={{
                uri: petInfo?.petPhotoUrl?.startsWith("http")
                  ? petInfo.petPhotoUrl
                  : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop",
            ***REMOVED***}
            />

            <View className="mt-4 flex-row items-center justify-between">
              <Typography
                className="font-semibold text-heading-text"
                variant="title-small"
              >
                {petInfo?.petName}
              </Typography>
              <View
                className="rounded-[6px] px-6 py-1"
                style={{ backgroundColor: status.backgroundColor }}
              >
                <Typography
                  className="text-[12px] font-bold"
                  style={{ color: status.textColor }}
                  variant="body-small"
                >
                  {status.label}
                </Typography>
              </View>
            </View>

            <View className="mt-3 flex-row flex-wrap gap-2">
              {petInfo?.petTypeLabel && (
                <PreviewBadge label={petInfo?.petTypeLabel} />
              )}
              {petInfo?.petSexLabel && petInfo?.petSexLabel !== "Unknown" && (
                <PreviewBadge label={petInfo?.petSexLabel} />
              )}
              {petInfo?.petSizeLabel && petInfo?.petSizeLabel !== "Unknown" && (
                <PreviewBadge label={petInfo?.petSizeLabel} />
              )}
              {petInfo?.petAgeCategoryLabel &&
                petInfo?.petAgeCategoryLabel !== "Unknown" && (
                  <PreviewBadge label={petInfo?.petAgeCategoryLabel} />
                )}
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-2">
                <Ionicons color="#111827" name="location-outline" size={17} />
                <Typography
                  className="flex-1 text-heading-text"
                  variant="body-small"
                  numberOfLines={2}
                >
                  {[
                    announcement?.nearLandmark,
                    announcement?.city,
                    announcement?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </View>
              <TouchableOpacity hitSlop={12} onPress={handleOpenMapPress}>
                <Typography
                  className="font-medium text-primary"
                  variant="body-small"
                >
                  Open map
                </Typography>
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex-row items-center gap-2">
              <Ionicons color="#111827" name="calendar-outline" size={17} />
              <Typography className="text-heading-text" variant="body-small">
                {announcement?.lastDateWhenSeen
                  ? `${new Date(announcement.lastDateWhenSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${announcement.approximateTime ? `, approx. ${announcement.approximateTime}` : ""}`
                  : "Unknown date"}
              </Typography>
            </View>

            <View className="mt-6 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-[#BFC9D6]" />
              <Typography
                className="text-[12px] text-secondary-text"
                variant="body-small"
              >
                pet details
              </Typography>
              <View className="h-px flex-1 bg-[#BFC9D6]" />
            </View>

            <Typography
              className="mt-3 text-[13px] text-heading-text"
              variant="body-small"
            >
              {petInfo?.description}
            </Typography>

            <View className="mt-6 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-[#BFC9D6]" />
              <Typography
                className="text-[12px] text-secondary-text"
                variant="body-small"
              >
                announcement description
              </Typography>
              <View className="h-px flex-1 bg-[#BFC9D6]" />
            </View>

            <Typography
              className="mt-3 text-[13px] text-heading-text"
              variant="body-small"
            >
              {announcement?.petDetails}
            </Typography>

            {(phoneNumber !== null || socialNetwork !== null) && (
              <View className="mt-5 gap-3">
                {phoneNumber !== null && (
                  <TouchableOpacity
                    className="flex-row items-center gap-3 rounded-[12px] border border-primary bg-white px-4 py-3"
                    onPress={() =>
                      void openContactUrl(
                        `tel:${phoneNumber}`,
                        "The phone application could not be opened.",
                      )
                  ***REMOVED***
                  >
                    <Ionicons name="call-outline" size={20} color="#D89F35" />
                    <View className="flex-1">
                      <Typography
                        className="text-secondary-text"
                        variant="body-small"
                      >
                        Phone number
                      </Typography>
                      <Typography
                        className="font-semibold text-heading-text"
                        variant="body-regular"
                      >
                        {phoneNumber}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                )}

                {socialNetwork !== null && (
                  <TouchableOpacity
                    className="flex-row items-center gap-3 rounded-[12px] border border-primary bg-white px-4 py-3"
                    onPress={() =>
                      void openContactUrl(
                        getSocialMediaUrl(socialNetwork),
                        "The social media link could not be opened.",
                      )
                  ***REMOVED***
                  >
                    <Ionicons
                      name="paper-plane-outline"
                      size={20}
                      color="#D89F35"
                    />
                    <View className="flex-1">
                      <Typography
                        className="text-secondary-text"
                        variant="body-small"
                      >
                        Social media
                      </Typography>
                      <Typography
                        className="font-semibold text-heading-text"
                        numberOfLines={2}
                        variant="body-regular"
                      >
                        {socialNetwork}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Comments section */}
          <View className="mt-6">
            <View className="border-t border-[#F4E8D0] bg-white px-6 pt-5 pb-2">
              <Typography
                className="font-semibold text-heading-text"
                variant="body-small"
              >
                Comments ({commentsData?.totalCount ?? 0})
              </Typography>
            </View>

            <View className="bg-white px-6">
              {isLoadingComments ? (
                <View className="items-center py-6">
                  <ActivityIndicator size="small" color="#F2C94C" />
                </View>
              ) : flatComments.length === 0 ? (
                <View className="items-center py-6">
                  <Typography
                    className="text-center text-secondary-text"
                    variant="body-small"
                  >
                    No comments yet. Be the first!
                  </Typography>
                </View>
              ) : (
                flatComments.map(({ comment, depth }) => (
                  <View
                    key={comment.id}
                    className="border-b border-[#F4E8D0] py-3"
                    style={{ paddingLeft: depth * 16 }}
                  >
                    <Typography
                      className="font-bold text-heading-text"
                      variant="body-small"
                    >
                      {comment.author.userName}
                    </Typography>
                    <Typography
                      className={`mt-0.5 ${comment.isDeleted ? "italic text-secondary-text" : "text-heading-text"}`}
                      variant="body-small"
                    >
                      {comment.isDeleted
                        ? "Comment deleted"
                        : comment.commentMessage}
                    </Typography>
                    {!comment.isDeleted && comment.imageUrl && (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setFullScreenImageUrl(comment.imageUrl!)}
                      >
                        <Image
                          source={{ uri: comment.imageUrl }}
                          className="mt-2 rounded-[8px]"
                          style={{ width: "100%", height: 200 }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        {/* Selected image preview */}
        {selectedImage && (
          <View className="border-t border-[#F4E8D0] bg-white px-4 pt-3">
            <View className="relative self-start">
              <Image
                source={{ uri: selectedImage.uri }}
                className="rounded-[8px]"
                style={{ width: 72, height: 72 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-heading-text"
              >
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Comment input bar */}
        <View className="flex-row items-center gap-3 border-t border-[#F4E8D0] bg-white px-4 py-3">
          <View className="flex-1 rounded-[15px] bg-[#F0F1F3] px-4 py-3">
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add your comment..."
              placeholderTextColor="#8D8D8D"
              multiline
              style={{ fontSize: 16, color: "#0F172A", maxHeight: 100 }}
              returnKeyType="send"
              onSubmitEditing={handleSubmitComment}
              blurOnSubmit={false}
            />
          </View>

          {/* Camera button */}
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isSending}
            className="h-[49px] w-[49px] items-center justify-center rounded-full bg-primary"
            style={{ opacity: isSending ? 0.5 : 1 }}
          >
            <Ionicons name="camera-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          {/* Send button */}
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!canSend}
            className="h-[49px] w-[49px] items-center justify-center rounded-full bg-primary"
            style={{ opacity: canSend ? 1 : 0.5 }}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <Ionicons name="arrow-up" size={20} color="#0F172A" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

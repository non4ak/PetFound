import React, { startTransition, useState } from "react";
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  type SignInResponse,
} from "@react-native-google-signin/google-signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleLoginMutation, useLoginMutation } from "@/data/hooks/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  loginSchema,
  type LoginFormValues,
} from "@/utils/validations/authSchema";

const GOOGLE_LOGO_SOURCE: ImageSourcePropType = require("@/assets/images/google-logo.png");

export default function LoginScreen() {
  const auth = useAuth();
  const [isGoogleSignInPending, setIsGoogleSignInPending] =
    useState<boolean>(false);
  const googleLoginMutation = useGoogleLoginMutation();
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
***REMOVED*** = useForm<LoginFormValues>({
    defaultValues: {
      login: "",
      password: "",
  ***REMOVED***,
    resolver: zodResolver(loginSchema),
***REMOVED***);
  const isAuthActionPending: boolean =
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    isGoogleSignInPending;

  const completeGoogleLogin = async (): Promise<void> => {
    setIsGoogleSignInPending(true);

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
      ***REMOVED***);
    ***REMOVED***

      const googleResponse: SignInResponse = await GoogleSignin.signIn();

      if (isCancelledResponse(googleResponse)) {
        return;
    ***REMOVED***

      if (!isSuccessResponse(googleResponse)) {
        throw new Error("Google sign-in failed.");
    ***REMOVED***

      const idToken: string | null = googleResponse.data.idToken;

      if (idToken === null || idToken.trim().length === 0) {
        throw new Error("Google sign-in did not return an ID token.");
    ***REMOVED***

      const session = await googleLoginMutation.mutateAsync({
        idToken,
    ***REMOVED***);

      await auth.completeSignIn(session);

      startTransition(() => {
        router.replace(
          auth.isOnboardingActive ? "/(onboarding)/profile" : "/(tabs)",
        );
    ***REMOVED***);
  ***REMOVED*** catch (error) {
      console.error("Google Sign-In failed.", {
        code: isErrorWithCode(error) ? error.code : null,
        hasWebClientId:
          typeof process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID === "string" &&
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.trim().length > 0,
        message: error instanceof Error ? error.message : null,
        name: error instanceof Error ? error.name : null,
        platform: Platform.OS,
    ***REMOVED***);

      setError("root", {
        message: getApiErrorMessage(
          error,
          "Unable to sign in with Google right now.",
        ),
    ***REMOVED***);
  ***REMOVED*** finally {
      setIsGoogleSignInPending(false);
  ***REMOVED***
***REMOVED***;

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      const session = await loginMutation.mutateAsync({
        login: values.login.trim(),
        password: values.password,
    ***REMOVED***);

      await auth.completeSignIn(session);

      startTransition(() => {
        router.replace(
          auth.isOnboardingActive ? "/(onboarding)/profile" : "/(tabs)",
        );
    ***REMOVED***);
  ***REMOVED*** catch (error) {
      setError("root", {
        message: getApiErrorMessage(error, "Unable to sign in right now."),
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;

  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-8 pt-4 pb-8 flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-foreground-background"
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View className="mb-8">
            <Typography variant="title-large">Welcome{"\n"}back</Typography>
            <Typography variant="body-regular" className="mt-2">
              Sign in to continue helping reunite lost pets.
            </Typography>
          </View>

          <View className="flex-col gap-5">
            <Controller
              control={control}
              name="login"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={errors.login?.message}
                  keyboardType="email-address"
                  label="Email or username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your email or username"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  errorText={errors.password?.message}
                  isPassword
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your password"
                  value={value}
                />
              )}
            />
          </View>

          <TouchableOpacity className="mt-3 self-end">
            <Typography variant="body-small" className="font-bold text-primary">
              Forgot password?
            </Typography>
          </TouchableOpacity>

          <View className="mt-8">
            <Button
              disabled={isAuthActionPending}
              errorText={errors.root?.message}
              fullWidth
              label={loginMutation.isPending ? "Signing In..." : "Log In"}
              onPress={handleSubmit(handleLogin)}
              size="lg"
              variant="primary"
            />
          </View>

          <View className="my-6 flex-row items-center">
            <View className="h-px flex-1 bg-light-gray" />
            <Typography variant="body-small" className="mx-4 text-neutral-400">
              or
            </Typography>
            <View className="h-px flex-1 bg-light-gray" />
          </View>

          <View className="flex-col gap-3">
            <Button
              disabled={isAuthActionPending}
              fullWidth
              label={
                isGoogleSignInPending || googleLoginMutation.isPending
                  ? "Connecting..."
                  : "Continue with Google"
            ***REMOVED***
              leadingIcon={
                <Image
                  resizeMode="contain"
                  source={GOOGLE_LOGO_SOURCE}
                  style={{ height: 20, width: 20 }}
                />
            ***REMOVED***
              onPress={completeGoogleLogin}
              size="md"
              variant="outline"
            />
          </View>

          <View className="flex-1" />
          <View className="mt-8 flex-row items-center justify-center">
            <Typography variant="body-small" className="text-neutral-400">
              Don&apos;t have an account?{" "}
            </Typography>
            <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
              <Typography
                variant="body-small"
                className="font-bold text-primary"
              >
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

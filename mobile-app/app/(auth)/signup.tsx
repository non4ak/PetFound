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
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useGoogleLoginMutation, useRegisterMutation } from "@/data/hooks/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/utils/validations/authSchema";

const GOOGLE_LOGO_SOURCE: ImageSourcePropType = require("@/assets/images/google-logo.png");

export default function SignUpScreen() {
  const auth = useAuth();
  const { clearOnboardingDraft } = useOnboarding();
  const [isGoogleSignInPending, setIsGoogleSignInPending] =
    useState<boolean>(false);
  const googleLoginMutation = useGoogleLoginMutation();
  const registerMutation = useRegisterMutation();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
      username: "",
    },
    resolver: zodResolver(signUpSchema),
  });
  const isAuthActionPending: boolean =
    registerMutation.isPending ||
    googleLoginMutation.isPending ||
    isGoogleSignInPending;

  const handleGoogleSignUp = async (): Promise<void> => {
    setIsGoogleSignInPending(true);

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const googleResponse: SignInResponse = await GoogleSignin.signIn();

      if (isCancelledResponse(googleResponse)) {
        return;
      }

      if (!isSuccessResponse(googleResponse)) {
        throw new Error("Google sign-in failed.");
      }

      const idToken: string | null = googleResponse.data.idToken;

      if (idToken === null || idToken.trim().length === 0) {
        throw new Error("Google sign-in did not return an ID token.");
      }

      const session = await googleLoginMutation.mutateAsync({
        idToken,
      });

      clearOnboardingDraft();
      await auth.startOnboarding();
      await auth.completeSignIn(session);

      startTransition(() => {
        router.replace("/(onboarding)/profile");
      });
    } catch (error) {
      console.error("Google Sign-In failed.", {
        code: isErrorWithCode(error) ? error.code : null,
        hasWebClientId:
          typeof process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID === "string" &&
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.trim().length > 0,
        message: error instanceof Error ? error.message : null,
        name: error instanceof Error ? error.name : null,
        platform: Platform.OS,
      });

      setError("root", {
        message: getApiErrorMessage(
          error,
          "Unable to sign in with Google right now.",
        ),
      });
    } finally {
      setIsGoogleSignInPending(false);
    }
  };

  const handleSignUp = async (values: SignUpFormValues): Promise<void> => {
    try {
      await registerMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
        userName: values.username.trim(),
      });
      clearOnboardingDraft();
      await auth.startOnboarding();
      auth.prepareEmailConfirmation({
        email: values.email.trim(),
        password: values.password,
      });

      startTransition(() => {
        router.replace("/(onboarding)/confirm-email");
      });
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(
          error,
          "Unable to create your account right now.",
        ),
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-8 pt-4 pb-8"
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
            <Typography variant="title-large">
              Create your{"\n"}account
            </Typography>
            <Typography variant="body-regular" className="mt-2">
              Join our community and help reunite lost pets with their families.
            </Typography>
          </View>

          <View className="flex-col gap-5">
            <Controller
              control={control}
              name="username"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={errors.username?.message}
                  label="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Choose a username"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={errors.email?.message}
                  keyboardType="email-address"
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your email"
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
                  helperText="Use 6+ chars with uppercase, lowercase, and a number"
                  isPassword
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Create a password"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  errorText={errors.confirmPassword?.message}
                  isPassword
                  label="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Confirm your password"
                  value={value}
                />
              )}
            />
          </View>

          <View className="mt-8">
            <Button
              disabled={isAuthActionPending}
              errorText={errors.root?.message}
              fullWidth
              label={
                registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"
              }
              onPress={handleSubmit(handleSignUp)}
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
              }
              leadingIcon={
                <Image
                  resizeMode="contain"
                  source={GOOGLE_LOGO_SOURCE}
                  style={{ height: 20, width: 20 }}
                />
              }
              onPress={handleGoogleSignUp}
              size="md"
              variant="outline"
            />
          </View>

          <View className="mt-8 flex-row items-center justify-center">
            <Typography variant="body-small" className="text-neutral-400">
              Already have an account?{" "}
            </Typography>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Typography
                variant="body-small"
                className="font-bold text-primary"
              >
                Log In
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

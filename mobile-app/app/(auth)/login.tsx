import React, { startTransition } from "react";
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
import { useLoginMutation } from "@/data/hooks/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  loginSchema,
  type LoginFormValues,
} from "@/utils/validations/authSchema";

const GOOGLE_LOGO_SOURCE: ImageSourcePropType = require("@/assets/images/google-logo.png");

export default function LoginScreen() {
  const auth = useAuth();
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      const session = await loginMutation.mutateAsync({
        login: values.login.trim(),
        password: values.password,
      });

      await auth.completeSignIn(session);

      startTransition(() => {
        router.replace(
          auth.isOnboardingActive ? "/(onboarding)/profile" : "/(tabs)",
        );
      });
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(error, "Unable to sign in right now."),
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
              disabled={loginMutation.isPending}
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
              disabled
              fullWidth
              label="Continue with Google"
              leadingIcon={
                <Image
                  resizeMode="contain"
                  source={GOOGLE_LOGO_SOURCE}
                  style={{ height: 20, width: 20 }}
                />
              }
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

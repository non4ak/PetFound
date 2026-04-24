import React, { startTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginMutation } from '@/data/hooks/auth';
import { getApiErrorMessage } from '@/utils/apiError';
import { loginSchema, type LoginFormValues } from '@/utils/validations/authSchema';

export default function LoginScreen() {
  const auth = useAuth();
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
***REMOVED*** = useForm<LoginFormValues>({
    defaultValues: {
      login: '',
      password: '',
  ***REMOVED***,
    resolver: zodResolver(loginSchema),
***REMOVED***);

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      const session = await loginMutation.mutateAsync({
        login: values.login.trim(),
        password: values.password,
    ***REMOVED***);

      await auth.completeSignIn(session);

      startTransition(() => {
        router.replace(auth.isOnboardingActive ? '/(onboarding)/profile' : '/(tabs)');
    ***REMOVED***);
  ***REMOVED*** catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Unable to sign in right now.'),
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;

  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <Typography variant="title-large">
              Welcome{'\n'}back
            </Typography>
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
                  leadingIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
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
                  leadingIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
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
              label={loginMutation.isPending ? 'Signing In...' : 'Log In'}
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
              leadingIcon={<Ionicons name="logo-google" size={20} color="#0F172A" />}
              size="md"
              variant="outline"
            />
            <Button
              disabled
              fullWidth
              label="Continue with Apple"
              leadingIcon={<Ionicons name="logo-apple" size={20} color="#0F172A" />}
              size="md"
              variant="outline"
            />
          </View>

          <View className="flex-1" />
          <View className="mt-8 flex-row items-center justify-center">
            <Typography variant="body-small" className="text-neutral-400">
              Don&apos;t have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
              <Typography variant="body-small" className="font-bold text-primary">
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

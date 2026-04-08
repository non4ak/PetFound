import React, { startTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { useRegisterMutation } from '@/data/hooks/auth';
import { getApiErrorMessage } from '@/utils/apiError';
import { signUpSchema, type SignUpFormValues } from '@/utils/validations/authSchema';

export default function SignUpScreen() {
  const registerMutation = useRegisterMutation();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
***REMOVED*** = useForm<SignUpFormValues>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      username: '',
  ***REMOVED***,
    resolver: zodResolver(signUpSchema),
***REMOVED***);

  const handleSignUp = async (values: SignUpFormValues): Promise<void> => {
    try {
      await registerMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
        userName: values.username.trim(),
    ***REMOVED***);

      Alert.alert(
        'Account created',
        'Check your email to confirm your account before logging in.',
      );

      startTransition(() => {
        router.replace('/(auth)/login');
    ***REMOVED***);
  ***REMOVED*** catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Unable to create your account right now.'),
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
              Create your{'\n'}account
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
                  leadingIcon={<Ionicons name="person-outline" size={20} color="#9CA3AF" />}
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
                  leadingIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
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
                  leadingIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
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
                  leadingIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
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
              disabled={registerMutation.isPending}
              errorText={errors.root?.message}
              fullWidth
              label={registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
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

          <View className="mt-8 flex-row items-center justify-center">
            <Typography variant="body-small" className="text-neutral-400">
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Typography variant="body-small" className="font-bold text-primary">
                Log In
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

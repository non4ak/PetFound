import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement login logic
        console.log('Login', { email, password });
    };

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
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-foreground-background items-center justify-center mb-6"
                    >
                        <Ionicons name="arrow-back" size={22} color="#0F172A" />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="mb-8">
                        <Typography variant="title-large">
                            Welcome{'\n'}back
                        </Typography>
                        <Typography variant="body-regular" className="mt-2">
                            Sign in to continue helping reunite lost pets.
                        </Typography>
                    </View>

                    {/* Form */}
                    <View className="flex-col gap-5">
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leadingIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            leadingIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                        />
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity className="self-end mt-3">
                        <Typography variant="body-small" className="text-primary font-bold">
                            Forgot password?
                        </Typography>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <View className="mt-8">
                        <Button
                            label="Log In"
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={handleLogin}
                        />
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-light-gray" />
                        <Typography variant="body-small" className="mx-4 text-neutral-400">
                            or
                        </Typography>
                        <View className="flex-1 h-px bg-light-gray" />
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-col gap-3">
                        <Button
                            label="Continue with Google"
                            variant="outline"
                            size="md"
                            fullWidth
                            leadingIcon={<Ionicons name="logo-google" size={20} color="#0F172A" />}
                        />
                        <Button
                            label="Continue with Apple"
                            variant="outline"
                            size="md"
                            fullWidth
                            leadingIcon={<Ionicons name="logo-apple" size={20} color="#0F172A" />}
                        />
                    </View>

                    {/* Footer */}
                    <View className="flex-1" />
                    <View className="flex-row items-center justify-center mt-8">
                        <Typography variant="body-small" className="text-neutral-400">
                            Don't have an account?{' '}
                        </Typography>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
                            <Typography variant="body-small" className="text-primary font-bold">
                                Sign Up
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

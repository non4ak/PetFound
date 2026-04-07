import React from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-foreground-background">
      <Image
        source={require('../../assets/images/weclome-hero-image.jpg')}
        className="w-full h-[40%]"
        resizeMode="cover"
      />

      <View className="flex-1 bg-alt-bg rounded-t-[40px] px-8 py-16 gap-16 -mt-[8%]">
        <View className="flex-col gap-3">
          <Typography variant="hero-title">
            Finding them,{'\n'}together
          </Typography>
          <Typography variant="body-regular">
            The urban guardian for your furry friends. Reconnecting lost pets with their families through community alerts.
          </Typography>
        </View>

        <View className="flex-col gap-4">
          <Button
            label="Get Started"
            variant="primary"
            size="lg"
            fullWidth
            trailingIcon={<AntDesign name="arrow-right" size={20} color="black" />}
            onPress={() => router.push('/(auth)/signup')}
            className="rounded-full"
          />
          <Button
            label="Log In"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
            className="rounded-full"
          />
        </View>


      </View>
    </View>
  );
}

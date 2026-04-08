import { ActivityIndicator, View } from 'react-native';

export function FullscreenLoader() {
  return (
    <View className="flex-1 items-center justify-center bg-alt-bg">
      <ActivityIndicator color="#F4C542" size="large" />
    </View>
  );
}

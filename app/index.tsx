import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAppSelector } from '@/store';

export default function Index() {
  const { refreshToken, rehydrated } = useAppSelector(state => state.auth);

  if (!rehydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (refreshToken) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

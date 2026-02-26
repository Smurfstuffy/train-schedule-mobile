import { Redirect, Tabs } from 'expo-router';
import { useAppSelector } from '@/store';

export default function TabsLayout() {
  const refreshToken = useAppSelector(state => state.auth.refreshToken);

  if (!refreshToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}

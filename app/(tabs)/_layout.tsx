import { Redirect, Stack } from 'expo-router';
import { useAppSelector } from '@/store';

import { ScheduleFilterProvider } from '@/contexts/ScheduleFilterContext';

export default function TabsLayout() {
  const refreshToken = useAppSelector(state => state.auth.refreshToken);

  if (!refreshToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScheduleFilterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="filter" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="settings" />
      </Stack>
    </ScheduleFilterProvider>
  );
}

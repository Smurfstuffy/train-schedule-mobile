import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useAppSelector } from '@/store';

import { ScheduleFilterProvider } from '@/contexts/ScheduleFilterContext';
import { useScheduleSocket } from '@/hooks/useScheduleSocket';

const PRIMARY_BLUE = '#2563EB';

export default function TabsLayout() {
  const refreshToken = useAppSelector(state => state.auth.refreshToken);

  useScheduleSocket();

  if (!refreshToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScheduleFilterProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: PRIMARY_BLUE,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: { backgroundColor: '#000000', borderTopColor: '#1F2937' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Schedules',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favourites"
          options={{
            title: 'Favourites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="filter"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="[id]"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="settings"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="new-schedule"
          options={{ href: null }}
        />
      </Tabs>
    </ScheduleFilterProvider>
  );
}

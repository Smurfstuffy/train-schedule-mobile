import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScheduleCard } from '@/components/schedule';
import type { Schedule } from '@/types/components/schedule';

const MOCK_SCHEDULES: Schedule[] = [
  {
    id: '1',
    trainId: 'train-1',
    routeName: 'Kyiv - Lviv',
    departureDate: '2025-03-01T08:00:00.000Z',
    finishedDate: '2025-03-01T14:30:00.000Z',
    stops: ['Kyiv-Pasazhyrskyi', 'Vinnytsia', 'Zhmerynka', 'Ternopil', 'Lviv'],
    train: { trainTitle: 'Intercity+ 45', trainType: { name: 'Intercity' } },
  },
  {
    id: '2',
    trainId: 'train-2',
    routeName: 'Odesa - Kharkiv',
    departureDate: '2025-03-02T06:15:00.000Z',
    finishedDate: '2025-03-02T18:45:00.000Z',
    stops: ['Odesa-Holovna', 'Mykolaiv', 'Dnipro', 'Poltava', 'Kharkiv'],
    train: { trainTitle: 'Express 102', trainType: { name: 'Express' } },
  },
  {
    id: '3',
    trainId: 'train-3',
    routeName: 'Lviv - Uzhhorod',
    departureDate: '2025-03-03T09:00:00.000Z',
    finishedDate: '2025-03-03T12:20:00.000Z',
    stops: ['Lviv', 'Stryi', 'Mukachevo', 'Uzhhorod'],
    train: { trainTitle: 'Regional 12', trainType: { name: 'Regional' } },
  },
];

export default function TabsIndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.settingsButtonPressed,
          ]}
          hitSlop={12}
        >
          <Ionicons name="settings-outline" size={24} color="#E5E7EB" />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_SCHEDULES.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onPress={() => router.push(`/(tabs)/${schedule.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 4,
    borderRadius: 8,
  },
  settingsButtonPressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});

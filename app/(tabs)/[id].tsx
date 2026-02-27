import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleForm } from '@/components/schedule';
import { useScheduleQuery, getApiErrorMessage } from '@/lib/api';
import { useAppSelector } from '@/store';
import type { Schedule } from '@/types/api';
import { formatDateTime } from '@/utils/date';

function ReadOnlySchedule({ schedule }: { schedule: Schedule }) {
  const { routeName, departureDate, finishedDate, stops, train } = schedule;
  return (
    <View style={styles.card}>
      <Text style={styles.routeName}>{routeName}</Text>
      {train?.trainTitle ? (
        <Text style={styles.meta}>{train.trainTitle}</Text>
      ) : null}
      {train?.trainType?.name ? (
        <Text style={styles.meta}>{train.trainType.name}</Text>
      ) : null}
      <View style={styles.dates}>
        <Text style={styles.dateLabel}>Departure</Text>
        <Text style={styles.dateValue}>{formatDateTime(departureDate)}</Text>
      </View>
      <View style={styles.dates}>
        <Text style={styles.dateLabel}>Arrival</Text>
        <Text style={styles.dateValue}>{formatDateTime(finishedDate)}</Text>
      </View>
      {stops.length > 0 ? (
        <View style={styles.stops}>
          <Text style={styles.stopsLabel}>Stops</Text>
          <Text style={styles.stopsList}>{stops.join(' → ')}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function ScheduleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const role = useAppSelector(state => state.auth.user?.role);
  const isAdmin = role === 'admin';

  const { data: schedule, isLoading, error } = useScheduleQuery(id);

  if (!id) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
          </Pressable>
          <Text style={styles.title}>Schedule</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholder}>Missing schedule id.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !isAdmin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
          </Pressable>
          <Text style={styles.title}>Schedule</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholder}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin && (error || !schedule)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
          </Pressable>
          <Text style={styles.title}>Schedule</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholder}>
            {error ? getApiErrorMessage(error) : 'Schedule not found.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const title = schedule?.routeName ?? 'Schedule';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.backButton} />
      </View>

      {isAdmin ? (
        <ScheduleForm
          id={id}
          schedule={schedule ?? null}
          onSuccess={() => router.back()}
        />
      ) : schedule ? (
        <View style={styles.content}>
          <ReadOnlySchedule schedule={schedule} />
        </View>
      ) : null}
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
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    minWidth: 72,
  },
  dateValue: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  stops: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  stopsLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  stopsList: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
});

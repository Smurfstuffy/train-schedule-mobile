import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScheduleCard } from '@/components/schedule';
import { useSchedulesQuery, type Schedule } from '@/lib/api/schedule';
import { getApiErrorMessage } from '@/lib/api';

export default function TabsIndexScreen() {
  const router = useRouter();
  const { data: schedules, isLoading, isError, error } = useSchedulesQuery();

  const renderItem: ListRenderItem<Schedule> = ({ item }) => (
    <ScheduleCard
      schedule={item}
      onPress={() => router.push(`/(tabs)/${item.id}`)}
    />
  );

  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E5E7EB" />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{getApiErrorMessage(error)}</Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No schedules</Text>
      </View>
    );
  };

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
      <FlatList
        data={schedules ?? []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          (isLoading || isError || !schedules?.length) &&
            styles.listContentGrow,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  listContentGrow: {
    flexGrow: 1,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
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
import { getApiErrorMessage } from '@/lib/api';
import {
  useFavoritesQuery,
  useRemoveFavoriteMutation,
} from '@/lib/api/favorites';
import type { Schedule } from '@/types/api';

export default function FavouritesScreen() {
  const router = useRouter();
  const {
    data: favorites = [],
    isLoading,
    isError,
    error,
  } = useFavoritesQuery();
  const removeFavorite = useRemoveFavoriteMutation();

  const schedules: Schedule[] = useMemo(
    () =>
      favorites.map(f => f.schedule).filter((s): s is Schedule => s != null),
    [favorites],
  );

  const renderItem: ListRenderItem<Schedule> = ({ item }) => (
    <ScheduleCard
      schedule={item}
      onPress={() => router.push(`/(tabs)/${item.id}`)}
      isFavourite
      onToggleFavorite={() => removeFavorite.mutate(item.id)}
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
        <Ionicons name="heart-outline" size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No favourites yet</Text>
        <Text style={styles.emptySubtext}>
          Add schedules from the Schedules tab
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          hitSlop={12}
        >
          <Ionicons name="settings-outline" size={24} color="#E5E7EB" />
        </Pressable>
      </View>
      <FlatList
        data={schedules}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          (isLoading || isError || !schedules.length) && styles.listContentGrow,
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
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  iconButton: {
    padding: 4,
    borderRadius: 8,
  },
  iconButtonPressed: {
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
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  listContentGrow: {
    flexGrow: 1,
  },
});

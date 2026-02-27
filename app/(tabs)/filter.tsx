import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button, Dropdown, Input } from '@/components/common';
import { useScheduleFilter } from '@/contexts/ScheduleFilterContext';
import { scheduleKeys } from '@/lib/api/schedule';
import { useTrainTypesQuery } from '@/lib/api/trains';
import { ButtonVariant } from '@/types/components';

export default function FilterScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { filters, setFilters, resetFilters } = useScheduleFilter();
  const { data: trainTypes = [], isLoading: loadingTypes } =
    useTrainTypesQuery();

  const [dateFrom, setDateFrom] = useState(filters.dateFrom ?? '');
  const [dateTo, setDateTo] = useState(filters.dateTo ?? '');
  const [routeName, setRouteName] = useState(filters.routeName ?? '');
  const [trainTypeId, setTrainTypeId] = useState(filters.trainTypeId ?? '');

  const trainTypeOptions = [
    { value: '', label: 'All train types' },
    ...trainTypes.map(tt => ({ value: tt.id, label: tt.name })),
  ];

  const handleApply = () => {
    setFilters({
      dateFrom: dateFrom.trim() || undefined,
      dateTo: dateTo.trim() || undefined,
      routeName: routeName.trim() || undefined,
      trainTypeId: trainTypeId.trim() || undefined,
    });
    router.back();
  };

  const handleReset = () => {
    resetFilters();
    queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.title}>Filter</Text>
        <View style={styles.backButton} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Filter schedules by date, route, or train type
          </Text>
          <Input
            label="Date from (YYYY-MM-DD)"
            value={dateFrom}
            onChangeText={setDateFrom}
            placeholder="e.g. 2025-03-01"
            containerStyle={styles.field}
          />
          <Input
            label="Date to (YYYY-MM-DD)"
            value={dateTo}
            onChangeText={setDateTo}
            placeholder="e.g. 2025-03-31"
            containerStyle={styles.field}
          />
          <Input
            label="Route name"
            value={routeName}
            onChangeText={setRouteName}
            placeholder="e.g. Kyiv - Lviv"
            containerStyle={styles.field}
          />
          {loadingTypes ? (
            <View style={styles.loadingTypes}>
              <ActivityIndicator size="small" color="#9CA3AF" />
              <Text style={styles.loadingText}>Loading train types...</Text>
            </View>
          ) : (
            <Dropdown
              label="Train type"
              value={trainTypeId || null}
              options={trainTypeOptions}
              placeholder="All train types"
              onSelect={setTrainTypeId}
              containerStyle={styles.field}
            />
          )}
          <Button
            variant={ButtonVariant.Primary}
            onPress={handleApply}
            style={styles.applyButton}
          >
            Apply filter
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            onPress={handleReset}
            style={styles.resetButton}
          >
            Reset filters
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  loadingTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  applyButton: {
    marginTop: 24,
  },
  resetButton: {
    marginTop: 12,
  },
});

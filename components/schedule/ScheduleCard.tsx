import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ScheduleCardProps } from '@/types/components/schedule';
import { formatDateTime } from '@/utils/date';

function ScheduleCardComponent({ schedule, onPress }: ScheduleCardProps) {
  const { routeName, departureDate, finishedDate, stops, train } = schedule;

  const cardContent = (
    <>
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
          <Text style={styles.stopsList} numberOfLines={3}>
            {stops.join(' → ')}
          </Text>
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return <View style={styles.card}>{cardContent}</View>;
}

export const ScheduleCard = memo(ScheduleCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.9,
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

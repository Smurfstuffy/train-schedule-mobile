import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

export const ServerError = memo(function ServerError({
  message,
}: {
  message: string | null;
}) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
});

const styles = StyleSheet.create({
  error: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 20,
    textAlign: 'center',
  },
});

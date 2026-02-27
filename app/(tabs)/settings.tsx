import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/common';
import { logout as logoutApi } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearSession } from '@/store/slices/authSlice';
import { ButtonVariant } from '@/types/components';

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      dispatch(clearSession());
      router.replace('/(auth)/login');
    }
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
        <Text style={styles.title}>Settings</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.content}>
        {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
        {user?.role === 'admin' ? (
          <Button
            variant={ButtonVariant.Primary}
            onPress={() => router.push('/(tabs)/new-schedule')}
            style={styles.createButton}
          >
            Create new schedule
          </Button>
        ) : null}
        <Button variant={ButtonVariant.Secondary} onPress={handleLogout}>
          Log out
        </Button>
      </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  email: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  createButton: {
    marginBottom: 16,
  },
});

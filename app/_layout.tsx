import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { AuthRehydrate, store } from '@/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthRehydrate>
        <SafeAreaProvider>
          <ThemeProvider value={DarkTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </SafeAreaProvider>
      </AuthRehydrate>
    </Provider>
  );
}

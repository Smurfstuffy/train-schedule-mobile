import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Input } from '@/components/common';
import { ButtonVariant } from '@/types/components';
import { type LoginFormValues, loginSchema } from '@/types/auth';

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors('root');
    try {
      // TODO: call auth API, e.g. await api.login(values);
      console.log('Login', values);
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Something went wrong. Please try again.';
      setError('root', { message });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password"
                  containerStyle={styles.inputSpaced}
                  error={errors.password?.message}
                />
              )}
            />

            {(errors as { root?: { message?: string } }).root?.message ? (
              <Text style={styles.rootError}>
                {(errors as { root?: { message?: string } }).root?.message}
              </Text>
            ) : null}

            <View style={styles.buttonWrap}>
              <Button
                variant={ButtonVariant.Primary}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                Sign in
              </Button>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{"Don't have an account?"}</Text>
              <Button
                variant={ButtonVariant.Secondary}
                onPress={() => router.push('/register')}
                style={styles.footerButton}
              >
                Sign up
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
  },
  inputSpaced: {
    marginTop: 16,
  },
  rootError: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  footerButton: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
});

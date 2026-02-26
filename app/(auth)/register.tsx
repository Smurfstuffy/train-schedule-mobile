import { useRouter } from 'expo-router';
import { useState } from 'react';
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

import { Button, Input, ServerError } from '@/components/common';
import { register as registerApi, getApiErrorMessage } from '@/lib/api';
import { saveAuthSession } from '@/store/authStorage';
import { useAppDispatch } from '@/store';
import { setSession } from '@/store/slices/authSlice';
import { ButtonVariant } from '@/types/components';
import { type RegisterFormValues, registerSchema } from '@/types/auth';

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const res = await registerApi(values.email, values.password);
      await saveAuthSession(res.refreshToken, res.user);
      dispatch(setSession(res));
      router.replace('/login');
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
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
                  autoComplete="new-password"
                  containerStyle={styles.inputSpaced}
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Confirm password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="new-password"
                  containerStyle={styles.inputSpaced}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <ServerError message={serverError} />

            <View style={styles.buttonWrap}>
              <Button
                variant={ButtonVariant.Primary}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                Sign up
              </Button>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Button
                variant={ButtonVariant.Secondary}
                onPress={() => router.push('/login')}
                style={styles.footerButton}
              >
                Sign in
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

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

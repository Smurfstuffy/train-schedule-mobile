import { Button, Dropdown, Input, ServerError } from '@/components/common';
import {
  getApiErrorMessage,
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useScheduleQuery,
  useTrainsQuery,
  useUpdateScheduleMutation,
} from '@/lib/api';
import type { Schedule } from '@/types/api';
import { ButtonVariant } from '@/types/components';
import {
  createScheduleSchema,
  stopsStringToArray,
  updateScheduleSchema,
  type CreateScheduleFormValues,
  type ScheduleFormValues,
} from '@/types/schedule-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function scheduleToFormValues(schedule: Schedule): ScheduleFormValues {
  return {
    trainId: schedule.trainId ?? '',
    routeName: schedule.routeName,
    departureDate: schedule.departureDate.slice(0, 10),
    finishedDate: schedule.finishedDate.slice(0, 10),
    stopsString: schedule.stops.join(', '),
  };
}

const emptyFormValues: CreateScheduleFormValues = {
  trainId: '',
  routeName: '',
  departureDate: '',
  finishedDate: '',
  stopsString: '',
};

export interface ScheduleFormProps {
  id?: string;
  schedule?: Schedule | null;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function ScheduleForm({
  id,
  schedule: scheduleProp,
  onSuccess,
  submitLabel,
}: ScheduleFormProps) {
  const isEditMode = !!id;
  const [serverError, setServerError] = useState<string | null>(null);

  const query = useScheduleQuery(scheduleProp ? undefined : id);
  const schedule = scheduleProp ?? query.data;
  const isLoading = !scheduleProp && query.isLoading;
  const error = query.error;
  const { data: trains = [] } = useTrainsQuery();
  const createMutation = useCreateScheduleMutation();
  const updateMutation = useUpdateScheduleMutation();
  const deleteMutation = useDeleteScheduleMutation();

  const schema = isEditMode ? updateScheduleSchema : createScheduleSchema;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(schema) as Resolver<ScheduleFormValues>,
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (schedule && isEditMode) {
      reset(scheduleToFormValues(schedule));
    }
  }, [schedule, isEditMode, reset]);

  const onSubmit = (values: ScheduleFormValues) => {
    setServerError(null);
    if (isEditMode && id) {
      updateMutation.mutate(
        {
          id,
          dto: {
            trainId: values.trainId || undefined,
            routeName: values.routeName,
            departureDate: values.departureDate,
            finishedDate: values.finishedDate,
            stops: stopsStringToArray(values.stopsString),
          },
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: err => setServerError(getApiErrorMessage(err)),
        },
      );
    } else {
      const trainId = values.trainId?.trim();
      if (!trainId) {
        setServerError('Please select a train.');
        return;
      }
      createMutation.mutate(
        {
          trainId,
          routeName: values.routeName,
          departureDate: values.departureDate,
          finishedDate: values.finishedDate,
          stops: stopsStringToArray(values.stopsString),
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: err => setServerError(getApiErrorMessage(err)),
        },
      );
    }
  };

  const trainOptions = trains.map(t => ({
    value: t.id,
    label:
      [t.trainTitle, t.trainType?.name].filter(Boolean).join(' · ') || t.id,
  }));

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const defaultSubmitLabel = isEditMode ? 'Update schedule' : 'Create schedule';
  const buttonLabel = submitLabel ?? defaultSubmitLabel;

  if (isEditMode && isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (isEditMode && (error || !schedule)) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.errorText}>
          {error ? getApiErrorMessage(error) : 'Schedule not found.'}
        </Text>
      </View>
    );
  }

  return (
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
            name="routeName"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Route name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="e.g. Kyiv – Lviv"
                error={errors.routeName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="trainId"
            render={({ field: { value, onChange } }) => (
              <Dropdown
                label="Train"
                value={value || null}
                options={trainOptions}
                placeholder="Select train"
                onSelect={onChange}
                containerStyle={styles.inputSpaced}
              />
            )}
          />
          {errors.trainId?.message ? (
            <Text style={styles.fieldError}>{errors.trainId.message}</Text>
          ) : null}
          <Controller
            control={control}
            name="departureDate"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Departure date"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="YYYY-MM-DD"
                containerStyle={styles.inputSpaced}
                error={errors.departureDate?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="finishedDate"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Arrival date"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="YYYY-MM-DD"
                containerStyle={styles.inputSpaced}
                error={errors.finishedDate?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="stopsString"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Stops (comma-separated)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Stop A, Stop B, Stop C"
                containerStyle={styles.inputSpaced}
              />
            )}
          />
          <ServerError message={serverError} />
          <View style={styles.buttonWrap}>
            <Button
              variant={ButtonVariant.Primary}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isPending}
            >
              {buttonLabel}
            </Button>
            {isEditMode && id ? (
              <Button
                variant={ButtonVariant.Danger}
                onPress={() =>
                  deleteMutation.mutate(id, {
                    onSuccess: () => onSuccess?.(),
                    onError: err => setServerError(getApiErrorMessage(err)),
                  })
                }
                disabled={isPending}
                style={styles.deleteButton}
              >
                Delete
              </Button>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
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
    gap: 24,
  },
  deleteButton: {
    marginTop: 0,
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  fieldError: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
  },
});

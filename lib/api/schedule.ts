import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

import type {
  CreateScheduleDto,
  FilterSchedulesParams,
  Schedule,
  UpdateScheduleDto,
} from '@/types/api';
import { apiClient } from './axios';

export type {
  CreateScheduleDto,
  FilterSchedulesParams,
  Schedule,
  ScheduleTrain,
  ScheduleTrainType,
  UpdateScheduleDto,
} from '@/types/api';

export async function getSchedules(
  params?: FilterSchedulesParams,
): Promise<Schedule[]> {
  const { data } = await apiClient.get<Schedule[]>('/schedules', { params });
  return data;
}

export async function getSchedule(id: string): Promise<Schedule> {
  const { data } = await apiClient.get<Schedule>(`/schedules/${id}`);
  return data;
}

export async function createSchedule(
  dto: CreateScheduleDto,
): Promise<Schedule> {
  const { data } = await apiClient.post<Schedule>('/schedules', dto);
  return data;
}

export async function updateSchedule(
  id: string,
  dto: UpdateScheduleDto,
): Promise<Schedule> {
  const { data } = await apiClient.patch<Schedule>(`/schedules/${id}`, dto);
  return data;
}

export async function deleteSchedule(id: string): Promise<Schedule> {
  const { data } = await apiClient.delete<Schedule>(`/schedules/${id}`);
  return data;
}

// --- Query keys ---

export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters: FilterSchedulesParams | undefined) =>
    [...scheduleKeys.lists(), filters ?? {}] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
};

// --- TanStack Query hooks ---

export function useSchedulesQuery(
  filters?: FilterSchedulesParams,
  options?: Omit<
    UseQueryOptions<
      Schedule[],
      Error,
      Schedule[],
      ReturnType<typeof scheduleKeys.list>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: scheduleKeys.list(filters),
    queryFn: () => getSchedules(filters),
    ...options,
  });
}

export function useScheduleQuery(
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<
      Schedule | undefined,
      Error,
      Schedule | undefined,
      ReturnType<typeof scheduleKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: scheduleKeys.detail(id ?? ''),
    queryFn: () => (id ? getSchedule(id) : Promise.resolve(undefined)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateScheduleMutation(
  options?: UseMutationOptions<Schedule, Error, CreateScheduleDto>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    ...options,
  });
}

export function useUpdateScheduleMutation(
  options?: UseMutationOptions<
    Schedule,
    Error,
    { id: string; dto: UpdateScheduleDto }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateScheduleDto }) =>
      updateSchedule(id, dto),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(data.id) });
    },
    ...options,
  });
}

export function useDeleteScheduleMutation(
  options?: UseMutationOptions<Schedule, Error, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.removeQueries({ queryKey: scheduleKeys.detail(id) });
    },
    ...options,
  });
}

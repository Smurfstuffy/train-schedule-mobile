import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

import type { Favorite } from '@/types/api';
import { apiClient } from './axios';
import { scheduleKeys } from './schedule';

export type { Favorite } from '@/types/api';

export async function getFavorites(): Promise<Favorite[]> {
  const { data } = await apiClient.get<Favorite[]>('/favorites');
  return data;
}

export async function addFavorite(scheduleId: string): Promise<Favorite> {
  const { data } = await apiClient.post<Favorite>('/favorites', {
    scheduleId,
  });
  return data;
}

export async function removeFavorite(scheduleId: string): Promise<Favorite> {
  const { data } = await apiClient.delete<Favorite>(
    `/favorites/schedule/${scheduleId}`,
  );
  return data;
}

export const favoriteKeys = {
  all: ['favorites'] as const,
  list: () => [...favoriteKeys.all, 'list'] as const,
};

export function useFavoritesQuery(
  options?: Omit<
    UseQueryOptions<
      Favorite[],
      Error,
      Favorite[],
      ReturnType<typeof favoriteKeys.list>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    ...options,
  });
}

export function useAddFavoriteMutation(
  options?: UseMutationOptions<Favorite, Error, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    ...options,
  });
}

export function useRemoveFavoriteMutation(
  options?: UseMutationOptions<Favorite, Error, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    ...options,
  });
}

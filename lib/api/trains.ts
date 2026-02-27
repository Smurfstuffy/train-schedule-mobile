import { useQuery } from '@tanstack/react-query';
import { apiClient } from './axios';

export interface TrainType {
  id: string;
  name: string;
}

export interface Train {
  id: string;
  trainTitle: string;
  trainTypeId: string;
  trainType?: TrainType;
}

export async function getTrainTypes(): Promise<TrainType[]> {
  const { data } = await apiClient.get<TrainType[]>('/train-types');
  return data;
}

export async function getTrains(): Promise<Train[]> {
  const { data } = await apiClient.get<Train[]>('/trains');
  return data;
}

const trainTypesQueryKey = ['train-types'] as const;
const trainsQueryKey = ['trains'] as const;

export function useTrainTypesQuery() {
  return useQuery({
    queryKey: trainTypesQueryKey,
    queryFn: getTrainTypes,
  });
}

export function useTrainsQuery() {
  return useQuery({
    queryKey: trainsQueryKey,
    queryFn: getTrains,
  });
}

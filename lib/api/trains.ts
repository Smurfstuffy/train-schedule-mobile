import { useQuery } from '@tanstack/react-query';
import { apiClient } from './axios';

export interface TrainType {
  id: string;
  name: string;
}

export async function getTrainTypes(): Promise<TrainType[]> {
  const { data } = await apiClient.get<TrainType[]>('/train-types');
  return data;
}

const trainTypesQueryKey = ['train-types'] as const;

export function useTrainTypesQuery() {
  return useQuery({
    queryKey: trainTypesQueryKey,
    queryFn: getTrainTypes,
  });
}

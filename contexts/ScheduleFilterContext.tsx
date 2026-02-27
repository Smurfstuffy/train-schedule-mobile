import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FilterSchedulesParams } from '@/types/api';

interface ScheduleFilterContextValue {
  filters: FilterSchedulesParams;
  setFilters: (filters: FilterSchedulesParams) => void;
  resetFilters: () => void;
}

const ScheduleFilterContext = createContext<ScheduleFilterContextValue | null>(
  null,
);

export function ScheduleFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterSchedulesParams>({});

  const setFilters = useCallback((next: FilterSchedulesParams) => {
    setFiltersState(prev => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, setFilters, resetFilters],
  );

  return (
    <ScheduleFilterContext.Provider value={value}>
      {children}
    </ScheduleFilterContext.Provider>
  );
}

export function useScheduleFilter() {
  const ctx = useContext(ScheduleFilterContext);
  if (!ctx) {
    throw new Error(
      'useScheduleFilter must be used within ScheduleFilterProvider',
    );
  }
  return ctx;
}

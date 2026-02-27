import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAppSelector } from '@/store';
import { scheduleKeys } from '@/lib/api/schedule';
import { API_BASE_URL } from '@/lib/config';

const SCHEDULE_EVENTS = {
  created: 'schedule:created',
  updated: 'schedule:updated',
  deleted: 'schedule:deleted',
} as const;

export function useScheduleSocket(): void {
  const queryClient = useQueryClient();
  const accessToken = useAppSelector(state => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const socket: Socket = io(API_BASE_URL + '/schedules', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socket.on(SCHEDULE_EVENTS.created, () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    });

    socket.on(SCHEDULE_EVENTS.updated, (payload: { id?: string }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      if (payload?.id) {
        queryClient.invalidateQueries({
          queryKey: scheduleKeys.detail(payload.id),
        });
      }
    });

    socket.on(SCHEDULE_EVENTS.deleted, (payload: { id?: string }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      if (payload?.id) {
        queryClient.removeQueries({
          queryKey: scheduleKeys.detail(payload.id),
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, queryClient]);
}

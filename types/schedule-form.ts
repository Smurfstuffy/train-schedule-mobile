import { z } from 'zod';

const isoDateString = z
  .string()
  .min(1, 'Required')
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/,
    'Use ISO date (e.g. YYYY-MM-DD)',
  );

const baseScheduleFormSchema = {
  routeName: z.string().min(1, 'Route name is required'),
  departureDate: isoDateString,
  finishedDate: isoDateString,
  stopsString: z.string(),
};

export const updateScheduleSchema = z.object({
  trainId: z.string().optional(),
  ...baseScheduleFormSchema,
});

export const createScheduleSchema = z.object({
  trainId: z.string().min(1, 'Select a train'),
  ...baseScheduleFormSchema,
});

export type UpdateScheduleFormValues = z.infer<typeof updateScheduleSchema>;
export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>;

export type ScheduleFormValues = {
  trainId: string;
  routeName: string;
  departureDate: string;
  finishedDate: string;
  stopsString: string;
};

export function stopsStringToArray(s: string): string[] {
  return s
    .split(/[,\n]/)
    .map(x => x.trim())
    .filter(Boolean);
}

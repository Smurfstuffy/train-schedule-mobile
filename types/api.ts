export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
}

export interface ScheduleTrainType {
  id: string;
  name: string;
}

export interface ScheduleTrain {
  id: string;
  trainTitle: string;
  trainTypeId: string;
  trainType?: ScheduleTrainType;
}

export interface Schedule {
  id: string;
  trainId: string;
  routeName: string;
  departureDate: string;
  finishedDate: string;
  stops: string[];
  train?: ScheduleTrain;
}

export interface CreateScheduleDto {
  trainId: string;
  routeName: string;
  departureDate: string;
  finishedDate: string;
  stops: string[];
}

export interface UpdateScheduleDto {
  trainId?: string;
  routeName?: string;
  departureDate?: string;
  finishedDate?: string;
  stops?: string[];
}

export interface FilterSchedulesParams {
  dateFrom?: string;
  dateTo?: string;
  routeName?: string;
  trainTypeId?: string;
}

export interface Favorite {
  id: string;
  scheduleId: string;
  schedule?: Schedule;
  createdAt?: string;
}

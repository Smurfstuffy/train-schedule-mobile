export interface Schedule {
  id: string;
  trainId: string;
  routeName: string;
  departureDate: string;
  finishedDate: string;
  stops: string[];
  train?: {
    trainTitle: string;
    trainType?: { name: string };
  };
}

export interface ScheduleCardProps {
  schedule: Schedule;
  onPress?: () => void;
  isFavourite?: boolean;
  onToggleFavorite?: () => void;
}

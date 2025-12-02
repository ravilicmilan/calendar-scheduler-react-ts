export type PriorityType = 'very-low' | 'low' | 'normal' | 'high' | 'very-high';

export type ScheduleType = {
  meetingId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  priority: PriorityType;
};

export type ApiTypes = {
  fetchSchedule: () => Promise<ScheduleType[]>;
};

export type TimeScheduleType = {
  time: string;
  schedule: ScheduleType | null;
};

export type TimeDurationType = {
  startTime: string;
  endTime: string;
};

export type TimeType = {
  hours: number;
  minutes: number;
};

export type AvailableTimesType = {
  time: string;
  availableForStart: boolean;
  availableForEnd: boolean;
};

export type DateType = {
  day: number;
  monthIndex: number;
  year: number;
};

export type DateArrayType = {
  available: boolean;
  day: number;
  weekend: boolean;
};

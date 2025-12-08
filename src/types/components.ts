import type { ReactNode, Ref } from 'react';
import type {
  AvailableTimesType,
  DateArrayType,
  PriorityType,
  ScheduleType,
} from './api';

export type ListProps = {
  schedule: ScheduleType[];
  date: string;
};

export type ListItemProps = {
  schedule: ScheduleType;
};

export interface ModalProps {
  children: ReactNode;
  title?: string;
}

export type PickerProps = {
  data: number[] | string[] | AvailableTimesType[] | DateArrayType[];
  title?: string;
  setSelectedValue: (value: string | number) => void;
  value: number | string;
  goToPrevGroupYear?: () => void;
  goToNextGroupYear?: () => void;
  yearsArr?: number[][];
  yearIdx?: number;
  changeGroup?: () => void;
  groupIdx?: number;
  timesArr?: AvailableTimesType[];
  goToPrevMonth?: () => void;
  goToNextMonth?: () => void;
  dateTitle?: string;
};

export type PickerYearControlsProps = {
  goToPrevGroupYear: () => void;
  goToNextGroupYear: () => void;
  yearsArr: number[][];
  yearIdx: number;
};

export type PickerDateControlsProps = {
  dateTitle: string;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
};

type PickerVariants = 'month' | 'year' | 'time' | 'priority' | 'date' | 'none';

export type PickerType = {
  el?: HTMLElement | null;
  variant?: PickerVariants;
  show: boolean;
  field?: keyof FormType;
};

export type GroupListItemProps = {
  onItemClick: () => void;
  text: string;
  priority: PriorityType;
};

type ModalVariants = 'card' | 'daily-schedule' | 'form' | 'none';

export type ModalType = {
  show: boolean;
  variant?: ModalVariants;
};

export type DailyScheduleProps = {
  dailySchedule: ScheduleType[];
  updateSchedule: (dailySchedule: ScheduleType) => void;
  deleteSchedule: (id: string) => void;
};

export type FormProps = {
  updateSchedule: (item: ScheduleType) => void;
};

export type ButtonType = {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: string;
  size?: string;
  text?: string;
  ref?: Ref<HTMLDivElement>;
  disabled?: boolean;
};

export type RectType = {
  id: number;
  top: number;
  bottom: number;
};

export type FormType = {
  meetingId: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  description: string;
  priority: PriorityType;
  isEdit: boolean;
};

export type PickerTimeProps = {
  changeGroup: () => void;
  groupIdx: number;
};

import type appState from '../store/app-state';
import type { AvailableTimesType, ScheduleType } from './api';
import type { FormType, ModalType, PickerType } from './components';

export type AppStateType = {
  modal: ModalType;
  scheduleData: ScheduleType[];
  currentSchedule: ScheduleType | null;
  picker: PickerType;
  formEntry: FormType;
  date: string;
  timeAvailableSlots: AvailableTimesType[];
};

export type AppState = typeof appState;

export interface StoreApi {
  get: () => AppState;
  set: (value: Partial<AppState>) => void;
  subscribe: (callback: () => void) => () => void;
}

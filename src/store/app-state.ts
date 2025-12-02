import type { AppStateType } from '../types/state';
import { resetEntry } from '../utils/api';
import { getDateStr } from '../utils/helpers';
const date = new Date();
const dateStr = getDateStr(date.getFullYear(), date.getMonth(), date.getDate());

export function getInitialAppState(): AppStateType {
  return {
    modal: {
      show: false,
    },
    scheduleData: [],
    currentSchedule: null,
    picker: {
      el: null,
      variant: 'none',
      show: false,
    },
    formEntry: { ...resetEntry(undefined) },
    date: dateStr,
    timeAvailableSlots: [],
  };
}

const appState: AppStateType = getInitialAppState();

export default appState;

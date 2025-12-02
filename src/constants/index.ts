import type { PriorityType } from '../types/api';

export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const HOURS_IN_DAY = Array.from({ length: 24 }, (_, i) => i);

export const PRIORITY_ORDER: Record<PriorityType, number> = {
  'very-low': 1,
  low: 2,
  normal: 3,
  high: 4,
  'very-high': 5,
};

export const PRIORITY_ARRAY = Object.keys(PRIORITY_ORDER).map((key) => key);

export const TIME_HEIGHT = 32;

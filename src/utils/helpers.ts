import { PRIORITY_ORDER } from '../constants';
import type {
  DateArrayType,
  DateType,
  ScheduleType,
  TimeDurationType,
  TimeType,
} from '../types/api';

export function createArray(arr: (number | string)[]): number[] {
  const newArr: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];

    if (
      current === '..' &&
      i > 0 &&
      typeof arr[i - 1] === 'number' &&
      typeof arr[i + 1] === 'number'
    ) {
      const start = arr[i - 1] as number;
      const end = arr[i + 1] as number;

      newArr.pop();

      for (let j = start; j <= end; j++) {
        newArr.push(j);
      }

      i++;
    } else if (typeof current === 'number') {
      newArr.push(current);
    }
  }

  return newArr;
}

export function groupYears() {
  const yearsArr = createArray([1971, '..', 2070]);
  const groupArr: number[][] = [];
  let innerIdx = 0;

  yearsArr.forEach((year, idx) => {
    if (idx % 20 === 0) {
      if (idx > 19) {
        innerIdx++;
      }

      groupArr.push([year]);
    } else {
      if (!Array.isArray(groupArr[innerIdx])) {
        groupArr.push([]);
      }
      groupArr[innerIdx].push(year);
    }
  });

  return groupArr;
}

export function findYearGroup(year: number) {
  const years = groupYears();
  let foundIdx = -1;

  years.some((group, i) => {
    if (group.includes(year)) {
      foundIdx = i;
      return;
    }
  });

  return foundIdx;
}

export function getTimeStringArr(isExtended = false) {
  const arr: string[] = [];

  for (let i = 0; i < 24; i++) {
    const t = `${numToStr(i)}:00`;
    if (isExtended) {
      const t2 = `${numToStr(i)}:30`;
      arr.push(t);
      arr.push(t2);
    } else {
      arr.push(t);
    }
  }

  return arr;
}

export function getHighestPriority(arr: ScheduleType[]) {
  arr.sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority];
    const priorityB = PRIORITY_ORDER[b.priority];

    return priorityB - priorityA;
  });

  return arr[0].priority;
}

export function getDateStr(
  year: number,
  monthIndex: number,
  day: number
): string {
  return new Date(Date.UTC(year, monthIndex, day)).toISOString().split('T')[0];
}

export function getDateObj(date: string): DateType {
  const d = new Date(date);
  return {
    day: d.getDate(),
    monthIndex: d.getMonth(),
    year: d.getFullYear(),
  };
}

export function norm(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

export function lerp(norm: number, min: number, max: number): number {
  return (max - min) * norm + min;
}

export function map(
  value: number,
  sourceMin: number,
  sourceMax: number,
  destMin: number,
  destMax: number
): number {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

export function calculateDuration(time1: string, time2: string): TimeType {
  const time1Obj = strToTime(time1);
  const time2Obj = strToTime(time2);
  const totalMinutes1 = time1Obj.hours * 60 + time1Obj.minutes;
  const totalMinutes2 = time2Obj.hours * 60 + time2Obj.minutes;
  const diff = totalMinutes2 - totalMinutes1;
  const hours = Math.floor(diff / 60);
  const minutes = diff - hours * 60;
  const obj = { hours, minutes };
  return obj;
}

export function calculateNewTimes(
  schedule: ScheduleType,
  updateTime: string
): TimeDurationType {
  const { startTime, endTime } = schedule;
  const duration = calculateDuration(startTime, endTime);
  const updateTimeObj = strToTime(updateTime);
  let newEndHour = updateTimeObj.hours + duration.hours;
  let newEndMinutes = updateTimeObj.minutes + duration.minutes;

  if (newEndMinutes > 60) {
    newEndMinutes = newEndMinutes - 60;
    newEndHour += 1;
  }

  const endTimeStr = timeToStr(newEndHour, newEndMinutes);

  const obj = {
    startTime: updateTime,
    endTime: endTimeStr,
  };
  return obj;
}

export function numToStr(num: number): string {
  return num <= 9 ? `0${num}` : `${num}`;
}

export function timeToStr(hours: number, minutes: number): string {
  const hourStr = numToStr(hours);
  const minutesStr = numToStr(minutes);
  return `${hourStr}:${minutesStr}`;
}

export function strToTime(time: string): TimeType {
  const timeArr = time.split(':');
  const hours = parseInt(timeArr[0]);
  const minutes = parseInt(timeArr[1]);
  return { hours, minutes };
}

export function timeToMinutes(timeObj: TimeType): number {
  const { hours, minutes } = timeObj;
  return hours * 60 + minutes;
}

export function isWeekend(dayIndex: number): boolean {
  return dayIndex === 6 || dayIndex === 0;
}

export function createDateArr(date: string): DateArrayType[] {
  const dateArr = [];
  const dateObj = getDateObj(date);
  const firstDayOfMonth = new Date(
    dateObj.year,
    dateObj.monthIndex,
    1
  ).getDay();
  const daysInMonth = new Date(
    dateObj.year,
    dateObj.monthIndex + 1,
    0
  ).getDate();

  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const dayOfMonth = week * 7 + day - firstDayOfMonth + 1;
      if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
        dateArr.push({
          available: false,
          day: -1,
          weekend: isWeekend(day),
        });
      } else {
        dateArr.push({
          available: true,
          day: dayOfMonth,
          weekend: isWeekend(day),
        });
      }
    }
  }

  return dateArr;
}

function goToMonthYear(date: string, next: boolean): string {
  const dateObj = getDateObj(date);
  let month = dateObj.monthIndex;
  let year = dateObj.year;

  if (next) {
    if (dateObj.monthIndex === 11) {
      month = 0;
      year = dateObj.year + 1;
    } else {
      month = dateObj.monthIndex + 1;
    }
  } else {
    if (dateObj.monthIndex === 0) {
      month = 11;
      year = dateObj.year - 1;
    } else {
      month = dateObj.monthIndex - 1;
    }
  }

  return getDateStr(year, month, dateObj.day);
}

export function goToPrevMonth(date: string): string {
  return goToMonthYear(date, false);
}

export function goToNextMonth(date: string): string {
  return goToMonthYear(date, true);
}

export function getScheduleFromStorage(): ScheduleType[] | null {
  const data = localStorage.getItem('schedule_data');

  if (data) {
    return JSON.parse(data) as ScheduleType[];
  } else {
    return null;
  }
}

export function saveScheduleToStorage(data: ScheduleType[]) {
  localStorage.setItem('schedule_data', JSON.stringify(data));
}

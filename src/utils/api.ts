import scheduleData from '../data/schedule.json';
import type {
  AvailableTimesType,
  ScheduleType,
  TimeScheduleType,
} from '../types/api';
import type { FormType } from '../types/components';
import {
  getDateStr,
  getScheduleFromStorage,
  getTimeStringArr,
  strToTime,
  timeToMinutes,
} from './helpers';

export async function fetchSchedule(): Promise<ScheduleType[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getScheduleFromStorage();
      if (!data) {
        return resolve(scheduleData as unknown as ScheduleType[]);
      } else {
        return resolve(data);
      }
    }, 500); // Simulate network delay
  });
}

export function getScheduleByMonthAndYear(
  data: ScheduleType[],
  month: number,
  year: number
): ScheduleType[] {
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === month && itemDate.getFullYear() === year;
  });
}

export function getScheduleByDate(
  data: ScheduleType[],
  date: string
): ScheduleType[] {
  const filteredData = data.filter((item) => item.date === date);

  return filteredData;
}

export function getScheduleByTime(
  time: string,
  data: ScheduleType[]
): ScheduleType | undefined {
  return data.find((item) => item.startTime === time || item.endTime === time);
}

export function buildScheduleTimeArr(data: ScheduleType[]): TimeScheduleType[] {
  const times = getTimeStringArr();
  const timesArr: TimeScheduleType[] = [];

  times.forEach((t) => {
    const schedule = getScheduleByTime(t, data);
    if (schedule) {
      timesArr.push({ time: t, schedule });
    } else {
      timesArr.push({ time: t, schedule: null });
    }
  });

  return timesArr;
}

export function checkFreeSlotTime(
  schedule: ScheduleType[],
  startTime: string,
  endTime: string
): boolean {
  let available = true;
  const startMinutes = timeToMinutes(strToTime(startTime));
  const endMinutes = timeToMinutes(strToTime(endTime));

  schedule.some((item) => {
    const itemStartTime = timeToMinutes(strToTime(item.startTime));
    const itemEndTime = timeToMinutes(strToTime(item.endTime));
    if (
      (itemStartTime <= startMinutes && startMinutes <= itemEndTime) ||
      (itemStartTime <= endMinutes && endMinutes <= itemEndTime)
    ) {
      available = false;
    }
  });

  return available;
}

export function checkForAvailableTimes(
  schedule: ScheduleType[]
): AvailableTimesType[] {
  const timeArr = getTimeStringArr(true);
  const timeObjArr: AvailableTimesType[] = timeArr.map((t) => ({
    time: t,
    availableForStart: true,
    availableForEnd: true,
  }));

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    const startTime = item.startTime;
    const endTime = item.endTime;
    const startIdx = timeObjArr.findIndex((t) => t.time === startTime);
    const endIdx = timeObjArr.findIndex((t) => t.time === endTime);
    if (startIdx !== -1 && endIdx !== -1) {
      for (let j = startIdx; j <= endIdx - 1; j++) {
        timeObjArr[j].availableForStart = false;
      }
      for (let j = startIdx + 1; j <= endIdx; j++) {
        timeObjArr[j].availableForEnd = false;
      }
    }
  }

  return timeObjArr;
}

export function createGroupTimeArr(
  timeArr: AvailableTimesType[]
): AvailableTimesType[][] {
  const offset = timeArr.length / 2;

  const arr1 = timeArr.slice(0, offset);
  const arr2 = timeArr.slice(offset);
  return [arr1, arr2];
}

export function resetEntry(dateInput: string | undefined): FormType {
  let dateStr;
  if (dateInput) {
    dateStr = dateInput;
  } else {
    const d = new Date();
    dateStr = getDateStr(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return {
    meetingId: '',
    title: '',
    date: dateStr,
    description: '',
    startTime: '00:00',
    endTime: '00:00',
    priority: 'normal',
    isEdit: false,
  };
}

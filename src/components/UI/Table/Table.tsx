import { DAYS } from '../../../constants';
import {
  fetchSchedule,
  getScheduleByDate,
  getScheduleByMonthAndYear,
  resetEntry,
} from '../../../utils/api';
import './Table.css';
import type { ScheduleType } from '../../../types/api';
import List from '../List/List';
import { useDispatch, useSelector } from '../../../store/app-store';
import { useCallback, useEffect } from 'react';
import { getDateObj, getDateStr, isWeekend } from '../../../utils/helpers';

export default function Table() {
  const data = useSelector((state) => state.scheduleData);
  const dateFromState = useSelector((state) => state.date);
  const { monthIndex, year } = getDateObj(dateFromState);
  const dispatch = useDispatch();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchSchedule();
      dispatch({ scheduleData: data });
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderTableHeading = () => {
    return DAYS.map((day) => (
      <span className='day-heading' key={day}>
        {day}
      </span>
    ));
  };

  const handleDayClick = (day: number) => {
    //console.log('DAY', { day, monthIndex, year });
    const newDate = getDateStr(year, monthIndex, day);
    dispatch({
      modal: { show: true, variant: 'daily-schedule' },
      date: newDate,
      formEntry: { ...resetEntry(newDate) },
    });
  };

  const renderTableBody = () => {
    const weeks = [];
    const dataForMonth = getScheduleByMonthAndYear(data, monthIndex, year);

    for (let week = 0; week < 6; week++) {
      const days = [];
      let totalBlankDays = 0;
      for (let day = 0; day < 7; day++) {
        let scheduleForDay: ScheduleType[] = [];
        let dateString = '';
        const dayOfMonth = week * 7 + day - firstDayOfMonth + 1;
        const blankDayClasses = `day day-blank ${
          isWeekend(day) ? 'day-weekend' : ''
        }`;
        const currentDayClasses = `day current-day ${
          isWeekend(day) ? 'day-weekend' : ''
        }`;
        const dayClasses = `day ${isWeekend(day) ? 'day-weekend' : ''}`;

        if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
          dateString = getDateStr(year, monthIndex, dayOfMonth);
          scheduleForDay = getScheduleByDate(dataForMonth, dateString);
        }

        if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
          let str = '';

          if (dayOfMonth < 1) {
            let prevMonth: number;
            let prevYear: number;

            if (monthIndex === 0) {
              prevYear = year - 1;
              prevMonth = 11;
            } else {
              prevMonth = monthIndex - 1;
              prevYear = year;
            }

            const totalDaysInPrevMonth = new Date(
              prevYear,
              prevMonth + 1,
              0
            ).getDate();

            str = String(Math.abs(dayOfMonth + totalDaysInPrevMonth));
          }

          if (dayOfMonth > daysInMonth) {
            str = String(totalBlankDays + 1);
          }

          totalBlankDays++;
          days.push(
            <div key={day}>
              <div className={blankDayClasses}>
                <span className='day-of-month'>{str}</span>
              </div>
            </div>
          );
          continue;
        }

        if (
          dayOfMonth === today &&
          monthIndex === currentMonth &&
          year === currentYear
        ) {
          days.push(
            <div key={day}>
              <div
                onClick={() => {
                  handleDayClick(dayOfMonth);
                }}
                className={currentDayClasses}
              >
                <span className='day-of-month'>{dayOfMonth}</span>
                {scheduleForDay.length > 0 && (
                  <List schedule={scheduleForDay} date={dateString} />
                )}
              </div>
            </div>
          );
          continue;
        }

        days.push(
          <div key={day}>
            <div
              onClick={() => {
                handleDayClick(dayOfMonth);
              }}
              className={dayClasses}
            >
              <span className='day-of-month'>{dayOfMonth}</span>
              {scheduleForDay.length > 0 && (
                <List schedule={scheduleForDay} date={dateString} />
              )}
            </div>
          </div>
        );
      }
      if (totalBlankDays < 7) {
        weeks.push(
          <div className='table-row' key={week}>
            {days}
          </div>
        );
      }
    }
    return weeks;
  };

  const renderTable = () => {
    return (
      <div className='calendar-table'>
        <div className='table-heading'>
          <div className='table-row'>{renderTableHeading()}</div>
        </div>
        <div>{renderTableBody()}</div>
      </div>
    );
  };

  // console.log('TABLE RENDER:::::::', monthIndex, year, data);

  if (data.length === 0) {
    return <div>Loading schedule...</div>;
  }
  return renderTable();
}

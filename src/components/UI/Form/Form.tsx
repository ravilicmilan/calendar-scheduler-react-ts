import './Form.css';
import { useDispatch, useSelector } from '../../../store/app-store';
import Button from '../Button/Button';
import { useCallback, useEffect, useRef } from 'react';
import type { FormProps, FormType } from '../../../types/components';
import { checkForAvailableTimes, getScheduleByDate } from '../../../utils/api';
import type { ScheduleType } from '../../../types/api';

export default function Form(props: FormProps) {
  const formEntry = useSelector((state) => state.formEntry);
  const scheduleData = useSelector((state) => state.scheduleData);
  const dispatch = useDispatch();
  const { title, description, startTime, date, endTime, priority } = formEntry;
  const dailySchedule = getScheduleByDate(scheduleData, date);
  const { updateSchedule } = props;
  const priorityRef = useRef<HTMLElement | null>(null);
  const startTimeRef = useRef<HTMLElement | null>(null);
  const endTimeRef = useRef<HTMLElement | null>(null);
  const dateRef = useRef<HTMLElement | null>(null);

  const setAvailableTimeSlots = useCallback(() => {
    const data = checkForAvailableTimes(dailySchedule);

    if (startTime !== '00:00') {
      const idx = data.findIndex((d) => d.time === startTime);
      if (idx !== -1) {
        for (let i = 0; i <= idx; i++) {
          data[i].availableForEnd = false;
        }
      }
    }
    dispatch({ timeAvailableSlots: data });
  }, [dailySchedule, dispatch, startTime]);

  useEffect(() => {
    setAvailableTimeSlots();
  }, [setAvailableTimeSlots]);

  const validateForm = () => {
    return (
      startTime !== '00:00' &&
      endTime !== '00:00' &&
      title !== '' &&
      description !== '' &&
      date !== ''
    );
  };

  const updateState = <K extends keyof FormType>(
    key: K,
    value: FormType[K]
  ) => {
    if (formEntry) {
      const obj = { ...formEntry };
      obj[key] = value;
      dispatch({ formEntry: obj });
    }
  };

  const setTitle = (value: string) => {
    updateState('title', value);
  };

  const setDescription = (value: string) => {
    updateState('description', value);
  };

  const saveSchedule = () => {
    const item = { ...formEntry };
    if (!item.isEdit) {
      item.meetingId = String(Math.round(Math.random() * 10000000000000));
    }
    const obj: ScheduleType = { ...item, date };
    updateSchedule(obj);
  };

  const handlePriorityClick = () => {
    dispatch({
      picker: { show: true, variant: 'priority', el: priorityRef.current },
    });
  };

  const handleStartTimeClick = () => {
    dispatch({
      picker: {
        show: true,
        variant: 'time',
        el: startTimeRef.current,
        field: 'startTime',
      },
    });
  };

  const handleEndTimeClick = () => {
    dispatch({
      picker: {
        show: true,
        variant: 'time',
        el: endTimeRef.current,
        field: 'endTime',
      },
    });
  };

  const handleDateClick = () => {
    dispatch({
      picker: {
        show: true,
        variant: 'date',
        el: dateRef.current,
      },
    });
  };

  // console.log('FORM RENDER:::', formEntry, dailySchedule, date);

  return (
    <div className='form-wrapper'>
      <div className='form-row'>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          className='form-input'
        />
      </div>
      <div className='form-row'>
        <textarea
          className='form-textarea'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder='Description...'
        />
      </div>

      <div className='form-row'>
        <span
          ref={dateRef}
          className='form-date-picker'
          onClick={handleDateClick}
        >
          Date: {date}
        </span>
        <span
          ref={priorityRef}
          className={`form-priority priority-${priority}`}
          onClick={handlePriorityClick}
        >
          Priority: {priority}
        </span>
      </div>
      <div className='form-row'>
        <span
          ref={startTimeRef}
          onClick={handleStartTimeClick}
          className='form-time-picker'
        >
          Start Time: {startTime}
        </span>
        <span
          ref={endTimeRef}
          onClick={handleEndTimeClick}
          className='form-time-picker'
        >
          End Time: {endTime}
        </span>
      </div>
      <div className='form-row'>
        <Button disabled={!validateForm()} text='Save' onClick={saveSchedule} />
      </div>
    </div>
  );
}

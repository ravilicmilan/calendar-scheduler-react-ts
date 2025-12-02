import { useDispatch, useSelector } from '../../store/app-store';
import type { ScheduleType } from '../../types/api';
import { getScheduleByDate, resetEntry } from '../../utils/api';
import { saveScheduleToStorage } from '../../utils/helpers';
import DailySchedule from '../DailySchedule/DailySchedule';
import Card from '../UI/Card/Card';
import Form from '../UI/Form/Form';
import Modal from '../UI/Modal/Modal';

export default function ModalSelector() {
  const modal = useSelector((state) => state.modal);
  const currentSchedule = useSelector((state) => state.currentSchedule);
  const scheduleData = useSelector((state) => state.scheduleData);
  const formEntry = useSelector((state) => state.formEntry);
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date);
  const dailySchedule = getScheduleByDate(scheduleData, date);

  const updateSchedule = (item: ScheduleType) => {
    if (scheduleData && scheduleData.length > 0 && item) {
      const currentScheduleData = [...scheduleData];
      const idx = currentScheduleData.findIndex(
        (schedule) => schedule.meetingId === item.meetingId
      );
      if (idx !== -1) {
        currentScheduleData[idx] = item;
      } else {
        currentScheduleData.push(item);
      }

      if (modal.variant === 'daily-schedule') {
        dispatch({
          scheduleData: currentScheduleData,
        });
        saveScheduleToStorage(currentScheduleData);
      } else if (modal.variant === 'form') {
        dispatch({
          scheduleData: currentScheduleData,
          modal: { show: true, variant: 'daily-schedule' },
          formEntry: { ...resetEntry(date) },
        });
        saveScheduleToStorage(currentScheduleData);
      }
    }
  };

  const deleteSchedule = (id: string) => {
    if (scheduleData && scheduleData.length > 0 && id) {
      const newData = scheduleData.filter((s) => s.meetingId !== id);
      dispatch({ scheduleData: newData });
      saveScheduleToStorage(newData);
    }
  };

  if (modal.show) {
    if (modal.variant === 'card' && currentSchedule) {
      return (
        <Modal title={'Schedule'}>
          <Card {...currentSchedule} />
        </Modal>
      );
    } else if (modal.variant === 'daily-schedule' && dailySchedule) {
      return (
        <Modal title={`Daily Schedule for ${date}`}>
          <DailySchedule
            dailySchedule={dailySchedule}
            updateSchedule={updateSchedule}
            deleteSchedule={deleteSchedule}
          />
        </Modal>
      );
    } else if (modal.variant === 'form' && formEntry) {
      return (
        <Modal title={formEntry.meetingId === '' ? 'New Entry' : 'Edit Entry'}>
          <Form updateSchedule={updateSchedule} />
        </Modal>
      );
    }
  } else {
    return null;
  }
}

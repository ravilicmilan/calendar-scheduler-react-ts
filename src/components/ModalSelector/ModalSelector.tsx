import { useDispatch, useSelector } from '../../store/app-store';
import type { ScheduleType } from '../../types/api';
import type { FormType } from '../../types/components';
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

  const updateSchedule = (item: FormType) => {
    if (formEntry.isEdit) {
      updateExistingEntry(item);
    } else {
      insertNewEntry(item);
    }
  };

  const insertNewEntry = (item: FormType) => {
    const data = { ...item };
    delete data.isEdit;

    const newScheduleData = [...scheduleData];
    newScheduleData.push(data);

    dispatch({
      scheduleData: newScheduleData,
      modal: { show: true, variant: 'daily-schedule' },
      formEntry: { ...resetEntry(date) },
    });

    saveScheduleToStorage(newScheduleData);
    console.log('INSERT SUCCESS::');
  };

  const updateExistingEntry = async (item: FormType) => {
    const data = { ...item };
    delete data.isEdit;

    const newScheduleData = [...scheduleData];
    const idx = newScheduleData.findIndex((s) => s.id === data.id);
    if (idx !== -1) {
      newScheduleData[idx] = data;

      dispatch({
        scheduleData: newScheduleData,
        modal: { show: true, variant: 'daily-schedule' },
        formEntry: { ...resetEntry(date) },
      });
    }
    saveScheduleToStorage(newScheduleData);
    console.log('UPDATE SUCCESS::');
  };

  const moveCurrentSchedule = (item: ScheduleType) => {
    const newScheduleData = [...scheduleData];
    const idx = newScheduleData.findIndex((s) => s.id === item.id);
    if (idx !== -1) {
      newScheduleData[idx] = item;

      dispatch({
        scheduleData: newScheduleData,
      });
    }
    saveScheduleToStorage(newScheduleData);
    console.log('MOVE SUCCESS::');
  };

  const deleteSchedule = (id: number) => {
    if (scheduleData && scheduleData.length > 0 && id) {
      const newData = scheduleData.filter((s) => s.id !== id);
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
            moveCurrentSchedule={moveCurrentSchedule}
            deleteSchedule={deleteSchedule}
          />
        </Modal>
      );
    } else if (modal.variant === 'form' && formEntry) {
      return (
        <Modal title={formEntry.isEdit ? 'Edit Entry' : 'New Entry'}>
          <Form updateSchedule={updateSchedule} />
        </Modal>
      );
    }
  } else {
    return null;
  }
}

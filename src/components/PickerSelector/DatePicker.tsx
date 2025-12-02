import { MONTHS } from '../../constants';
import { useDispatch, useSelector } from '../../store/app-store';
import {
  createDateArr,
  getDateObj,
  getDateStr,
  goToNextMonth,
  goToPrevMonth,
} from '../../utils/helpers';
import Picker from '../UI/Picker/Picker';

export default function DatePicker() {
  const formEntry = useSelector((state) => state.formEntry);
  const { date } = formEntry;
  const dispatch = useDispatch();
  const dateArr = createDateArr(date);
  const dateObj = getDateObj(date);
  const month = MONTHS[dateObj.monthIndex];

  const setDate = (day: string | number) => {
    const value = typeof day === 'string' ? parseInt(day) : day;
    const newDate = getDateStr(dateObj.year, dateObj.monthIndex, value);
    dispatch({
      picker: { show: false },
      formEntry: { ...formEntry, date: newDate },
    });
  };

  const handlePrevMonth = () => {
    const newDate = goToPrevMonth(date);
    dispatch({ formEntry: { ...formEntry, date: newDate } });
  };

  const handleNextMonth = () => {
    const newDate = goToNextMonth(date);
    dispatch({ formEntry: { ...formEntry, date: newDate } });
  };

  return (
    <Picker
      data={dateArr}
      dateTitle={`${month} ${dateObj.year}`}
      title='DATE'
      setSelectedValue={setDate}
      value={dateObj.day}
      goToPrevMonth={handlePrevMonth}
      goToNextMonth={handleNextMonth}
    />
  );
}

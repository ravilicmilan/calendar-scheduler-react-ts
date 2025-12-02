import { MONTHS } from '../../constants';
import { useDispatch, useSelector } from '../../store/app-store';
import { getDateObj, getDateStr } from '../../utils/helpers';
import Picker from '../UI/Picker/Picker';

export default function MonthPicker() {
  const date = useSelector((state) => state.date);
  const { day, monthIndex, year } = getDateObj(date);
  const picker = useSelector((state) => state.picker);
  const dispatch = useDispatch();

  const setMonth = (value: string | number) => {
    const idx = MONTHS.findIndex((m) => m === value);
    const newDate = getDateStr(year, idx, day);
    if (idx !== -1) {
      dispatch({ picker: { ...picker, show: false }, date: newDate });
    }
  };

  return (
    <Picker
      data={MONTHS}
      setSelectedValue={setMonth}
      title='MONTHS'
      value={MONTHS[monthIndex]}
    />
  );
}

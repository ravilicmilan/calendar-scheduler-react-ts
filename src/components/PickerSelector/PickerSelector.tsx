import { useSelector } from '../../store/app-store';
import DatePicker from './DatePicker';
import MonthPicker from './MonthPicker';
import PriorityPicker from './PriorityPicker';
import TimePicker from './TimePicker';
import YearPicker from './YearPicker';

export default function PickerSelector() {
  const picker = useSelector((state) => state.picker);

  if (picker.show) {
    if (picker.variant === 'month') {
      return <MonthPicker />;
    } else if (picker.variant === 'year') {
      return <YearPicker />;
    } else if (picker.variant === 'priority') {
      return <PriorityPicker />;
    } else if (picker.variant === 'time') {
      return <TimePicker />;
    } else if (picker.variant === 'date') {
      return <DatePicker />;
    }
  } else {
    return null;
  }
}

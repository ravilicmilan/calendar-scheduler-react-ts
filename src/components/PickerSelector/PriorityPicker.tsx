import { PRIORITY_ARRAY } from '../../constants';
import Picker from '../UI/Picker/Picker';
import { useDispatch, useSelector } from '../../store/app-store';
import type { PriorityType } from '../../types/api';

export default function PriorityPicker() {
  const formEntry = useSelector((state) => state.formEntry);
  const picker = useSelector((state) => state.picker);
  const dispatch = useDispatch();

  const setPriority = (value: string | number) => {
    const p = value as PriorityType;
    dispatch({
      formEntry: { ...formEntry, priority: p },
      picker: { ...picker, show: false },
    });
  };

  return (
    <Picker
      data={PRIORITY_ARRAY}
      setSelectedValue={setPriority}
      title='PRIORITY'
      value={formEntry.priority}
    />
  );
}

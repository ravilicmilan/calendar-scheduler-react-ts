import { useState } from 'react';
import { useDispatch, useSelector } from '../../store/app-store';
import { createGroupTimeArr } from '../../utils/api';
import Picker from '../UI/Picker/Picker';

export default function TimePicker() {
  const dispatch = useDispatch();
  const fromEntry = useSelector((state) => state.formEntry);
  const picker = useSelector((state) => state.picker);
  const [groupIdx, setGroupIdx] = useState(0);
  const timeAvailableSlots = useSelector((state) => state.timeAvailableSlots);
  const groupTimeArr = createGroupTimeArr(timeAvailableSlots);
  const group = groupTimeArr[groupIdx];

  const handleSetTime = (value: string | number) => {
    if (picker.field) {
      dispatch({
        formEntry: { ...fromEntry, [picker.field]: value },
        picker: { show: false },
      });

      if (picker.field === 'startTime' || picker.field === 'endTime') {
        const data = [...timeAvailableSlots];
        const idx = data.findIndex((d) => d.time === value);

        if (idx !== -1) {
          if (picker.field === 'startTime') {
            for (let i = 0; i <= idx; i++) {
              data[i].availableForEnd = false;
            }
            let nextIdx;
            for (let i = 0; i < data.length; i++) {
              if (!data[i].availableForStart && data[i].time > value) {
                nextIdx = i;
                break;
              }
            }
            if (nextIdx) {
              for (let i = nextIdx; i < data.length; i++) {
                data[i].availableForEnd = false;
              }
              for (let i = idx + 1; i <= nextIdx; i++) {
                data[i].availableForEnd = true;
              }
            }

            dispatch({ timeAvailableSlots: data });
          }
        }
      }
    }
  };

  const changeGroup = () => {
    setGroupIdx(groupIdx === 0 ? 1 : 0);
  };

  let value = '00:00';

  if (
    picker.field &&
    (picker.field === 'startTime' || picker.field === 'endTime')
  ) {
    const key = picker.field;
    if (fromEntry[key]) {
      value = fromEntry[key];
    }
  }
  // console.log('TIME PICKER RENDER:::', timeAvailableSlots);
  return (
    <Picker
      data={group}
      title='Time'
      setSelectedValue={handleSetTime}
      value={value}
      changeGroup={changeGroup}
      groupIdx={groupIdx}
    />
  );
}

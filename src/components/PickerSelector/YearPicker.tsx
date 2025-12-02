import { useState } from 'react';
import { useDispatch, useSelector } from '../../store/app-store';
import {
  groupYears,
  findYearGroup,
  getDateObj,
  getDateStr,
} from '../../utils/helpers';
import Picker from '../UI/Picker/Picker';

export default function YearPicker() {
  const yearsArr = groupYears();
  const date = useSelector((state) => state.date);
  const { day, monthIndex, year } = getDateObj(date);
  const [yearIdx, setYearIdx] = useState(findYearGroup(year));
  const yearsGroup = yearsArr[yearIdx];
  const picker = useSelector((state) => state.picker);
  const dispatch = useDispatch();

  const setYear = (value: string | number) => {
    const normalized = typeof value === 'number' ? value : Number(value);
    const finalYear = Number.isFinite(normalized) ? normalized : year;
    const newDate = getDateStr(finalYear, monthIndex, day);
    dispatch({ date: newDate, picker: { ...picker, show: false } });
  };

  const goToPrevGroupYear = () => {
    const idx = yearIdx - 1;
    if (idx >= 0) {
      setYearIdx(idx);
    }
  };

  const goToNextGroupYear = () => {
    const idx = yearIdx + 1;
    if (idx < yearsArr.length) {
      setYearIdx(idx);
    }
  };

  return (
    <Picker
      data={yearsGroup}
      title='YEARS'
      setSelectedValue={setYear}
      value={year}
      goToPrevGroupYear={goToPrevGroupYear}
      goToNextGroupYear={goToNextGroupYear}
      yearsArr={yearsArr}
      yearIdx={yearIdx}
    />
  );
}

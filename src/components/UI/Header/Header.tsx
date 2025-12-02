import { useRef } from 'react';
import { useDispatch, useSelector } from '../../../store/app-store';

import './Header.css';
import { MONTHS } from '../../../constants';
import Button from '../Button/Button';
import {
  getDateObj,
  goToNextMonth,
  goToPrevMonth,
} from '../../../utils/helpers';

export default function Header() {
  const date = useSelector((state) => state.date);
  const { monthIndex, year } = getDateObj(date);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const dispatch = useDispatch();
  const month = MONTHS[monthIndex];

  const handlePrevMonth = () => {
    const newDate = goToPrevMonth(date);
    dispatch({ date: newDate });
  };

  const handleNextMonth = () => {
    const newDate = goToNextMonth(date);
    dispatch({ date: newDate });
  };

  const handleMonthClick = () => {
    dispatch({
      picker: {
        el: monthRef.current,
        variant: 'month',
        show: true,
      },
    });
  };

  const handleYearClick = () => {
    dispatch({ picker: { el: yearRef.current, variant: 'year', show: true } });
  };

  return (
    <>
      <div className='sub-header'>
        <Button onClick={handlePrevMonth} variant='left-arrow' size='large' />
        <span className='month-year'>
          <span
            ref={monthRef}
            onClick={handleMonthClick}
            className='header-month'
          >
            {month}
          </span>{' '}
          <span ref={yearRef} onClick={handleYearClick} className='header-year'>
            {year}
          </span>
        </span>
        <Button onClick={handleNextMonth} variant='right-arrow' size='large' />
      </div>
    </>
  );
}

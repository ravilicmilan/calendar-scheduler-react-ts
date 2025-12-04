/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react';
import './Picker.css';
import { useDispatch, useSelector } from '../../../store/app-store';
import type { PickerProps } from '../../../types/components';
import PickerYearControls from '../PickerControls/PickerYearControls';
import type { AvailableTimesType, DateArrayType } from '../../../types/api';
import PickerTimeControls from '../PickerControls/PickerTimeControls';
import PickerDateControls from '../PickerControls/PickerDateControls';

export default function Picker(props: PickerProps) {
  const [coords, setCoords] = useState({ top: -1000, left: -1000 });
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<HTMLDivElement | null>(null);
  const { data, setSelectedValue, title, value } = props;
  const picker = useSelector((state) => state.picker);
  const dispatch = useDispatch();

  const getCoordsOnMount = () => {
    if (picker.el && pickerRef.current && triangleRef.current) {
      const elRect = picker.el.getBoundingClientRect();
      const pickerRect = pickerRef.current.getBoundingClientRect();
      const triangleRect = triangleRef.current.getBoundingClientRect();
      if (window.innerWidth > 700) {
        setCoords({
          top: elRect.bottom + 10,
          left: elRect.left + elRect.width / 2 - pickerRect.width / 2,
        });
      } else {
        console.log('KOLIKO JE OVO???', window.innerHeight, pickerRect);
        setCoords({
          top: window.innerHeight / 2 - pickerRect.height / 2,
          left: 0,
        });
      }

      triangleRef.current.style.top = `-4px`;
      triangleRef.current.style.left = `${
        pickerRect.width / 2 - triangleRect.width / 2
      }px`;
    }
  };

  useEffect(() => {
    getCoordsOnMount();
  }, []);

  const handleItemClick = (val: number | string) => {
    setSelectedValue(val);
  };

  const closePicker = () => {
    dispatch({ picker: { show: false } });
  };

  const renderItems = () => {
    return data.map((item, idx) => {
      let classes = ``;
      let val: string | number = '';

      if (picker.variant === 'priority') {
        val = item as string | number;
        classes = ` picker-item-block priority-${item} `;
      } else if (picker.variant === 'time') {
        const t = item as AvailableTimesType;
        const available =
          picker.field === 'startTime'
            ? t.availableForStart
            : t.availableForEnd;
        val = t.time;
        classes = ` picker-item-inline-smaller ${
          !available ? ' picker-item-disabled' : ''
        }`;
      } else if (picker.variant === 'date') {
        const t = item as DateArrayType;
        val = !t.available ? '' : t.day;
        classes = ` picker-item-inline-grid `;
        if (val === '') {
          classes += ' picker-item-disabled ';
        }
        if (t.weekend) {
          classes += ' text-red-500 ';
        }
        if (value === val) {
          classes += ' picker-selected-item ';
        }
      } else {
        val = item as string | number;
        classes = 'picker-item-inline';
      }

      if (item === value) {
        classes += ' picker-selected-item';
      }

      return (
        <span
          className={classes}
          onClick={() => {
            if (picker.variant === 'time') {
              const t = item as AvailableTimesType;
              if (
                (picker.field === 'startTime' && !t.availableForStart) ||
                (picker.field === 'endTime' && !t.availableForEnd)
              ) {
                return false;
              } else {
                handleItemClick(t.time);
              }
            } else if (picker.variant === 'date') {
              const t = item as DateArrayType;
              if (t.available) {
                handleItemClick(val);
              }
            } else {
              handleItemClick(val);
            }
          }}
          key={idx}
        >
          {val}
        </span>
      );
    });
  };

  const renderPickerControls = () => {
    if (picker.variant === 'year') {
      const { goToNextGroupYear, goToPrevGroupYear, yearsArr, yearIdx } = props;
      if (
        typeof yearIdx === 'number' &&
        yearsArr &&
        yearsArr.length > 0 &&
        typeof goToNextGroupYear === 'function' &&
        typeof goToPrevGroupYear === 'function'
      ) {
        return (
          <PickerYearControls
            goToNextGroupYear={goToNextGroupYear}
            goToPrevGroupYear={goToPrevGroupYear}
            yearsArr={yearsArr}
            yearIdx={yearIdx}
          />
        );
      }
    } else if (picker.variant === 'time') {
      const { changeGroup, groupIdx } = props;
      if (typeof changeGroup === 'function' && typeof groupIdx === 'number') {
        return (
          <PickerTimeControls groupIdx={groupIdx} changeGroup={changeGroup} />
        );
      }
    } else if (picker.variant === 'date') {
      const { goToPrevMonth, goToNextMonth, dateTitle } = props;
      if (
        typeof goToPrevMonth === 'function' &&
        typeof goToNextMonth === 'function' &&
        dateTitle
      ) {
        return (
          <PickerDateControls
            dateTitle={dateTitle}
            goToPrevMonth={goToPrevMonth}
            goToNextMonth={goToNextMonth}
          />
        );
      }
    } else {
      return null;
    }
  };

  if (picker.el) {
    let classes = '';

    if (picker.variant === 'date') {
      classes = 'picker-items-grid-date';
    } else if (picker.variant === 'priority') {
      classes = 'picker-items-small';
    } else {
      classes = 'picker-items-large';
    }

    if (picker.variant === 'priority') {
      classes = 'picker-items-small';
    } else {
      classes = `picker-items-grid-${picker.variant}`;
    }

    return (
      <>
        <div onClick={closePicker} className='picker-background'></div>
        <div
          ref={pickerRef}
          className={`picker-wrapper ${
            picker.variant === 'priority'
              ? 'picker-wrapper-small'
              : 'picker-wrapper-large'
          }`}
          style={{ top: coords.top, left: coords.left }}
        >
          <div className='triangle-up' ref={triangleRef} />
          <div className='picker-header'>{title}</div>
          {renderPickerControls()}
          <div className={classes}>{renderItems()}</div>
        </div>
      </>
    );
  } else {
    return null;
  }
}

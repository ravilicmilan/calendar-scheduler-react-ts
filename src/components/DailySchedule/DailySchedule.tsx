import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react';
import type { ScheduleType } from '../../types/api';
import type { DailyScheduleProps, RectType } from '../../types/components';
import './DailySchedule.css';
import {
  calculateDuration,
  calculateNewTimes,
  getTimeStringArr,
  map,
  numToStr,
} from '../../utils/helpers';
import { TIME_HEIGHT } from '../../constants';
import Button from '../UI/Button/Button';
import { useDispatch, useSelector } from '../../store/app-store';
import { resetEntry } from '../../utils/api';

export default function DailySchedule(props: DailyScheduleProps) {
  const [showFullList, setShowFullList] = useState(false);
  const date = useSelector((state) => state.date);
  const dispatch = useDispatch();
  const [draggedItem, setDraggedItem] = useState<ScheduleType | null>(null);
  const isMoved = useRef(false);
  const { dailySchedule, moveCurrentSchedule, deleteSchedule } = props;
  const timeStringArr = getTimeStringArr();
  const moverRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [scheduleRects, setScheduleRects] = useState<RectType[]>([]);
  const [delta, setDelta] = useState(0);
  const canDrop = useRef(false);

  const getScheduleRects = (): RectType[] => {
    const arr: RectType[] = [];
    document
      .querySelectorAll('.daily-schedule-item-draggable')
      .forEach((div) => {
        const rect = div.getBoundingClientRect();
        arr.push({ id: Number(div.id), top: rect.top, bottom: rect.bottom });
      });
    return arr;
  };

  const checkCollision = useCallback(
    (top: number, bottom: number) => {
      let isColliding = false;

      for (let i = 0; i < scheduleRects.length; i++) {
        const rect = scheduleRects[i];
        if (
          draggedItem &&
          draggedItem.id !== rect.id &&
          ((rect.top < top && top < rect.bottom) ||
            (rect.top < bottom && bottom < rect.bottom) ||
            (top < rect.top && rect.bottom < bottom))
        ) {
          isColliding = true;
          break;
        }
      }

      return isColliding;
    },
    [scheduleRects, draggedItem]
  );

  const handleNewEntry = () => {
    // console.log('NEW ENTRY!');
    dispatch({
      modal: { show: true, variant: 'form' },
      formEntry: { ...resetEntry(date) },
    });
  };

  const editSchedule = (
    e: React.MouseEvent<HTMLDivElement>,
    item: ScheduleType
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('EDIT !!!', item);
    dispatch({
      modal: { variant: 'form', show: true },
      formEntry: { ...item, isEdit: true },
    });
  };

  const deleteCurrentSchedule = (
    e: React.MouseEvent<HTMLDivElement>,
    item: ScheduleType
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('DELETE !!!', item);
    deleteSchedule(item.id);
  };

  const onMouseDown = (
    e: React.MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    item: ScheduleType
  ) => {
    const target = e.target as HTMLElement;
    if (target.className.includes('btn')) {
      //console.log('BUTTON !!!!!!');
      return false;
    }

    let clientY: number;

    if ('touches' in e) {
      const modal = document.getElementById('modal-children');
      if (modal) {
        modal.style.overflowY = 'hidden';
      }
      if (e.touches && e.touches.length > 0) {
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientY = e.clientY;
    }

    isMoved.current = true;

    // console.log('START MOVE', e.target);
    if (scheduleRects.length === 0) {
      setScheduleRects(getScheduleRects());
    }

    if (listRef.current && moverRef.current) {
      setDraggedItem(item);
      const div = e.currentTarget as HTMLElement;
      const rect = div.getBoundingClientRect();
      const dy = clientY - rect.top;

      setDelta(dy);
      const parentList = listRef.current as HTMLElement;
      const parentRect = parentList.getBoundingClientRect();
      const top = parentRect.top - rect.top + dy;
      const mover = moverRef.current;
      mover.style.top = `${top}px`;
      mover.style.height = `${rect.height}px`;
      mover.style.display = 'flex';
      // console.log('PARENT DIMENSIONS::::', parentRect);
    }
  };

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      let clientY: number;

      if ('touches' in e) {
        if (e.touches && e.touches.length > 0) {
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      } else {
        clientY = e.clientY;
      }

      if (isMoved.current && moverRef.current && listRef.current) {
        // console.log('MOVING', clientY, delta);
        const parentList = listRef.current;
        const div = moverRef.current;
        const rect = div.getBoundingClientRect();
        const parentRect = parentList.getBoundingClientRect();
        const top = clientY - parentRect.top - delta;
        div.style.top = `${top}px`;

        const t = clientY - delta;
        const b = t + rect.height;
        const isColliding = checkCollision(t, b);
        if (isColliding) {
          div.classList.add('stop');
          canDrop.current = false;
        } else {
          div.classList.remove('stop');
          canDrop.current = true;
        }

        // div.innerHTML = `${t} ${b}`;
      }
    },
    [checkCollision, delta]
  );

  const onMouseUp = useCallback(() => {
    isMoved.current = false;

    const modal = document.getElementById('modal-children');
    if (modal) {
      modal.style.overflowY = 'auto';
    }

    if (!canDrop.current) {
      if (moverRef && moverRef.current) {
        moverRef.current.style.display = 'none';
      }

      return false;
    }

    if (moverRef.current && listRef.current && draggedItem) {
      const mover = moverRef.current;
      const rect = mover.getBoundingClientRect();
      const parent = listRef.current;
      const parentRect = parent?.getBoundingClientRect();
      mover.style.display = 'none';
      const top = rect.top - parentRect.top;
      const newWholeHour = Math.floor(top / TIME_HEIGHT);
      const newHourDecimal = top / TIME_HEIGHT;
      const diff = newHourDecimal - newWholeHour;
      let minutes = '00';

      if (diff >= 0.5) {
        minutes = '30';
      }

      const updateHourStr = numToStr(newWholeHour);
      const updateTimeStr = `${updateHourStr}:${minutes}`;
      const updatedItem = { ...draggedItem };
      const newTimes = calculateNewTimes(updatedItem, updateTimeStr);
      updatedItem.startTime = newTimes.startTime;
      updatedItem.endTime = newTimes.endTime;

      if (
        updatedItem.startTime === draggedItem.startTime &&
        updatedItem.endTime === draggedItem.endTime
      ) {
        // console.log('BACK TO SAME POSITION DO NOTHING!!');
        return false;
      }

      moveCurrentSchedule(updatedItem);

      setScheduleRects((prev) => {
        const arr = [...prev];
        const idx = arr.findIndex((a) => a.id === draggedItem.id);
        if (idx !== -1) {
          arr[idx] = { id: arr[idx].id, top: rect.top, bottom: rect.bottom };
        }
        return arr;
      });
    }
    setDraggedItem(null);
  }, [draggedItem, moveCurrentSchedule]);

  const disableContextMenuOnMobile = (e: MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);

    window.addEventListener('contextmenu', disableContextMenuOnMobile);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('contextmenu', disableContextMenuOnMobile);
    };
  }, [onMouseMove, onMouseUp]);

  const handleItemClick = (item: ScheduleType) => {
    const id = `buttons-wrapper-${item.id}`;
    const div = document.getElementById(id);
    if (div && window.innerWidth < 600) {
      console.log('NA MOBILNOM JE::');
      div.classList.toggle('daily-schedule-buttons-show');
    }
  };

  const renderButtons = () => {
    return (
      <div className='daily-schedule-buttons-wrapper'>
        {dailySchedule.length > 0 && (
          <Button
            text={showFullList ? 'Short List' : 'Full List'}
            onClick={() => {
              setShowFullList(!showFullList);
            }}
          />
        )}
        <Button text='+ New Entry' onClick={handleNewEntry} />
      </div>
    );
  };

  const renderMsg = () => {
    return (
      <div className='daily-schedule-no-items'>{'No schedule for today'}</div>
    );
  };

  const renderShortList = () => {
    return dailySchedule.map((item, idx) => (
      <div
        onClick={() => {
          handleItemClick(item);
        }}
        key={idx}
        className={`daily-schedule-item priority-${item.priority}`}
      >
        <div className='daily-schedule-item-left'>
          <span>{item.startTime}</span>
          {'  -  '}
          <span>{item.endTime}</span>
        </div>
        <div className='daily-schedule-item-right'>
          <div className='daily-schedule-item-right-title-wrapper'>
            <span className='font-bold'>{item.title}</span>
            <span>{item.description}</span>
          </div>
          <div
            id={`buttons-wrapper-${item.id}`}
            className='daily-schedule-item-buttons-wrapper'
          >
            <Button
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                editSchedule(e, item);
              }}
              size='small'
              variant='edit'
            />
            <Button
              size='small'
              variant='close'
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                deleteCurrentSchedule(e, item);
              }}
            />
          </div>
        </div>
      </div>
    ));
  };

  const renderFullList = () => {
    const items = timeStringArr.map((item, idx) => (
      <div key={idx} className='daily-schedule-empty-time'>
        {item}
      </div>
    ));

    return (
      <div className='daily-schedule-list' ref={listRef}>
        {items}
        {renderDraggableItems()}
        <div className='mover' ref={moverRef} />
      </div>
    );
  };

  const renderDraggableItems = () => {
    return dailySchedule.map((item, idx) => {
      const { startTime, endTime } = item;
      const startArrTime = startTime.split(':');
      const startHour = startArrTime[0];
      const startMinutes = startArrTime[1];

      let minutesMargin = 0;
      let height = TIME_HEIGHT;
      const duration = calculateDuration(startTime, endTime);

      if (startMinutes !== '00') {
        const minutes = parseInt(startMinutes);
        minutesMargin = map(minutes, 0, 60, 0, TIME_HEIGHT);
      }

      if (duration.hours && duration.hours > 0) {
        height = TIME_HEIGHT * duration.hours;
      }

      if (duration.minutes && duration.minutes > 0) {
        const minutesHeight = map(duration.minutes, 0, 60, 0, TIME_HEIGHT);
        height += minutesHeight;
      }

      const foundIdx = timeStringArr.findIndex((t) => {
        const hour = t.split(':')[0];

        return parseInt(hour) === parseInt(startHour);
      });
      return (
        <div
          key={idx}
          id={'${item.id}'}
          onMouseDown={(e) => {
            onMouseDown(e, item);
          }}
          onTouchStart={(e) => {
            onMouseDown(e, item);
          }}
          className={`daily-schedule-item-draggable `}
          style={{
            top: `${foundIdx * TIME_HEIGHT + minutesMargin}px`,
            height: `${height}px`,
          }}
          data-top={foundIdx * TIME_HEIGHT + minutesMargin}
        >
          <span className='daily-schedule-item-left-filler'></span>
          <span
            className={`daily-schedule-item-title priority-${item.priority}`}
          >
            {item.title}
            <div className='daily-schedule-item-buttons-wrapper'>
              <Button
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  editSchedule(e, item);
                }}
                size='small'
                variant='edit'
              />
              <Button
                size='small'
                variant='close'
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  deleteCurrentSchedule(e, item);
                }}
              />
            </div>
          </span>
        </div>
      );
    });
  };

  // console.log('DAILY SCHEDULE RENDER:::::', dailySchedule, scheduleRects);

  return (
    <div id='daily-schedule-wrapper' className='daily-schedule-wrapper'>
      {renderButtons()}
      {dailySchedule.length > 0
        ? showFullList
          ? renderFullList()
          : renderShortList()
        : renderMsg()}
    </div>
  );
}

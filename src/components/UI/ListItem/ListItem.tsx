import { useDispatch } from '../../../store/app-store';
import type { ListItemProps } from '../../../types/components';
import './ListItem.css';

export default function ListItem(props: ListItemProps) {
  const { schedule } = props;
  const dispatch = useDispatch();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    dispatch({
      modal: { show: true, variant: 'card' },
      currentSchedule: schedule,
    });
  };

  return (
    <div
      className={`list-item priority-${schedule.priority}`}
      onClick={handleClick}
    >
      <span className='list-item-title truncate-text'>{schedule.title}</span>
    </div>
  );
}

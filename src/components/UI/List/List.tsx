import type { ReactNode } from 'react';
import type { ListProps } from '../../../types/components';
import ListItem from '../ListItem/ListItem';
import GroupListItem from '../ListItem/GroupListItem';
import './List.css';
import { getHighestPriority } from '../../../utils/helpers';
import { useDispatch } from '../../../store/app-store';

export default function List(props: ListProps) {
  const { schedule, date } = props;
  const dispatch = useDispatch();

  const onItemClick = () => {
    dispatch({
      modal: { show: true, variant: 'daily-schedule' },
      date,
    });
  };

  const populateList = () => {
    const len = schedule.length;
    const arr: ReactNode[] = [];

    schedule.some((item, idx) => {
      if (idx < 2) {
        arr.push(<ListItem key={idx} schedule={item} />);
        return false;
      } else {
        const text = `${len - idx}+ more`;
        const partialArr = schedule.slice(idx, schedule.length);
        const priority = getHighestPriority(partialArr);
        arr.push(
          <GroupListItem
            key={idx}
            text={text}
            onItemClick={onItemClick}
            priority={priority}
          />
        );
        return true;
      }
    });

    return arr;
  };

  return <div className='list'>{populateList()}</div>;
}

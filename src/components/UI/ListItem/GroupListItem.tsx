import type { GroupListItemProps } from '../../../types/components';
import './ListItem.css';

export default function GroupListItem(props: GroupListItemProps) {
  const { onItemClick, text, priority } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onItemClick();
  };

  return (
    <div className={`list-item priority-${priority}`} onClick={handleClick}>
      <span className='list-item-title'>{text}</span>
    </div>
  );
}

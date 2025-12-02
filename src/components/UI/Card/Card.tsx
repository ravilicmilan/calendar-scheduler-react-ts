import type { ScheduleType } from '../../../types/api';
import './Card.css';

export default function Card(props: ScheduleType) {
  const { title, description, startTime, endTime, date, priority } = props;
  return (
    <div className='card'>
      <div className='row'>
        <div className='card-date'>{date}</div>
        <div className={`card-priority priority-${priority}`}>{priority}</div>
      </div>

      <div className='card-title'>{title}</div>
      <div className='card-description'>{description}</div>
      <div className='card-time-wrapper'>
        <div className='card-start-time'>From: {startTime}</div>
        <div className='card-end-time'>To: {endTime}</div>
      </div>
    </div>
  );
}

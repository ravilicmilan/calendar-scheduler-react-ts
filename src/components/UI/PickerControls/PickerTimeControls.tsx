import type { PickerTimeProps } from '../../../types/components';
import './PickerControls.css';

export default function PickerTimeControls(props: PickerTimeProps) {
  const { changeGroup, groupIdx } = props;

  return (
    <div className='picker-controls'>
      <div onClick={changeGroup} className='picker-time-control'>
        <span className='picker-time-control-inner'>
          <span className='picker-time-control-title'>
            {groupIdx === 0 ? 'Afternoon' : 'Morning'}
          </span>
          <span className='picker-time-control-triangle-wrapper'>
            <span className='picker-time-control-triangle-up'></span>
            <span className='picker-time-control-triangle-down'></span>
          </span>
        </span>
      </div>
    </div>
  );
}

import type { PickerDateControlsProps } from '../../../types/components';
import Button from '../Button/Button';
import './PickerControls.css';

export default function PickerDateControls(props: PickerDateControlsProps) {
  const { dateTitle, goToPrevMonth, goToNextMonth } = props;

  const renderTableHeadings = () => {
    const arr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return arr.map((item, idx) => (
      <span key={idx} className='picker-controls-headings'>
        {item}
      </span>
    ));
  };

  return (
    <>
      <div className='picker-controls'>
        <Button onClick={goToPrevMonth} variant='left-arrow' size='small' />
        <span className='picker-controls-title'>{dateTitle}</span>
        <Button onClick={goToNextMonth} variant='right-arrow' size='small' />
      </div>
      <div className='picker-controls-headings-wrapper'>
        {renderTableHeadings()}
      </div>
    </>
  );
}

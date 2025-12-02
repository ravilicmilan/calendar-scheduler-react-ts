import type { PickerYearControlsProps } from '../../../types/components';
import './PickerControls.css';

export default function PickerYearControls(props: PickerYearControlsProps) {
  const { yearIdx, yearsArr, goToPrevGroupYear, goToNextGroupYear } = props;

  let hasLeft = false;
  let hasRight = false;
  const leftIdx = yearIdx - 1;
  const righIdx = yearIdx + 1;
  let leftText = '';
  let rightText = '';

  if (leftIdx >= 0) {
    hasLeft = true;
    const min = Math.min(...yearsArr[leftIdx]);
    const max = Math.max(...yearsArr[leftIdx]);
    leftText = `${min}-${max}`;
  }

  if (righIdx < yearsArr.length) {
    hasRight = true;
    const min = Math.min(...yearsArr[righIdx]);
    const max = Math.max(...yearsArr[righIdx]);
    rightText = `${min}-${max}`;
  }

  return (
    <div className='picker-controls'>
      {hasLeft ? (
        <span onClick={goToPrevGroupYear} className='picker-control-left'>
          &lt; {leftText}
        </span>
      ) : (
        <span className='empty-span' />
      )}
      {hasRight ? (
        <span onClick={goToNextGroupYear} className='picker-control-right'>
          {rightText} &gt;
        </span>
      ) : (
        <span className='empty-span' />
      )}
    </div>
  );
}

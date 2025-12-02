import { useDispatch, useSelector } from '../../../store/app-store';
import type { ModalProps } from '../../../types/components';
import Button from '../Button/Button';
import './Modal.css';

export default function Modal({ children, title }: ModalProps) {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const handleCloseModal = () => {
    if (modal.variant === 'form') {
      dispatch({
        modal: { show: true, variant: 'daily-schedule' },
      });
    } else {
      dispatch({
        modal: { show: false, variant: 'none' },
        currentSchedule: null,
      });
    }
  };

  return (
    <div className='modal-wrapper'>
      <div className='modal-backdrop' onClick={handleCloseModal} />

      <div className='modal-inner'>
        <div onClick={(e) => e.stopPropagation()} className='modal-content'>
          <div className='modal-header'>
            {title && <h2 className='modal-title'>{title}</h2>}
            <Button onClick={handleCloseModal} size='medium' variant='close' />
          </div>
          <div className='modal-children'>{children}</div>
        </div>
      </div>
    </div>
  );
}

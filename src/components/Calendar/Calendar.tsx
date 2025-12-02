import './Calendar.css';
import Table from '../UI/Table/Table';
import Header from '../UI/Header/Header';
import PickerSelector from '../PickerSelector/PickerSelector';
import ModalSelector from '../ModalSelector/ModalSelector';

export default function Calendar() {
  return (
    <>
      <div className='calendar-wrapper'>
        <h1 className='heading'>Calendar</h1>
        <Header />
        <Table />
      </div>
      <ModalSelector />
      <PickerSelector />
    </>
  );
}

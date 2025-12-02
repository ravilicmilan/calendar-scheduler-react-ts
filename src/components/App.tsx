import { StoreProvider } from '../store/app-store';
import './App.css';
import Calendar from './Calendar/Calendar';

function App() {
  return (
    <StoreProvider>
      <Calendar />
    </StoreProvider>
  );
}

export default App;

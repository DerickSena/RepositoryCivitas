import ReactDOM from 'react-dom/client';
import App from './App';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

import ReactDOM from 'react-dom/client';
import App from './App';

import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';

dayjs.locale('pt-br');



ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
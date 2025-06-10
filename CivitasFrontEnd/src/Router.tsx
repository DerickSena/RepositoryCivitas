import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Cadastro } from './pages/regularizacaoImobiliaria.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Cadastro/>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

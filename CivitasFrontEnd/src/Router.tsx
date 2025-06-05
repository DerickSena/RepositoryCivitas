import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RegularizacaoImobiliaria } from './pages/regularizacaoImobiliaria.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RegularizacaoImobiliaria/>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

import { RouterProvider } from 'react-router';
import { router } from './Router';
import { ToastProvider } from './shared/context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
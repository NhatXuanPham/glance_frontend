import { RouterProvider } from 'react-router';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { router } from './routes';
import { store } from '@/store';

export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}
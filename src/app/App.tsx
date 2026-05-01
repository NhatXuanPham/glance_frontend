import { RouterProvider } from 'react-router';
import { Suspense } from 'react';
import { router } from './routes';

export default function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
  );
}
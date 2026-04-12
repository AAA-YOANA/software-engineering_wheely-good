import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { AllFeedback } from './pages/AllFeedback';
import { HighPriorityFeedback } from './pages/HighPriorityFeedback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AllFeedback />,
      },
      {
        path: 'high-priority',
        element: <HighPriorityFeedback />,
      },
    ],
  },
]);
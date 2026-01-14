// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainPage from '../pages/MainPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: 'main',
        element: <MainPage />
      },
      {
        path: 'project/:projectId',
        element: <MainPage />,
      },
      {
        path: 'project/:projectId/version/:versionId',
        element: <MainPage />,
      },
      {
        path: 'project/:projectId/version/:versionId/file/*',
        element: <MainPage />,
      }
    ]
  }
]);

export default router;
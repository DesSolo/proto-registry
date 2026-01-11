// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainPage from '../pages/MainPage';
import SettingsPage from '../pages/SettingsPage';
import HelpPage from '../pages/HelpPage';

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
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'help',
        element: <HelpPage />
      }
    ]
  }
]);

export default router;
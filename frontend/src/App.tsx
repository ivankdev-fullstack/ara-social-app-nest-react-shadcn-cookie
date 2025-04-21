import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { FeedPage } from './pages/FeedPage/FeedPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { PreferencesPage } from './pages/PreferencesPage/PreferencesPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

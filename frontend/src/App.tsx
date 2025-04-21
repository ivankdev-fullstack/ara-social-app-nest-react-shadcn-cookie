import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { FeedPage } from './pages/FeedPage/FeedPage';
import { PreferencesPage } from './pages/PreferencesPage/PreferencesPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

export const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <ProtectedRoute>
              <AuthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

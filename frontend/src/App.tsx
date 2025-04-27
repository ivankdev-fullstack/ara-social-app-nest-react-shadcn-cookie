import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { FeedPage } from './pages/FeedPage/FeedPage';
import { PostPage } from './pages/PostPage/PostPage';
import { PreferencesPage } from './pages/PreferencesPage/PreferencesPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

export const App = () => {
  return (
    <>
      <Routes>
        <Route
          index
          path="/"
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
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostPage />
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
        <Route path="*" element={<ProtectedRoute />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

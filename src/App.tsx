import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { StoreProvider } from './lib/store';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import WordPartDetail from './pages/WordPartDetail';
import Flashcards from './pages/Flashcards';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import Review from './pages/Review';
import Worlds from './pages/Worlds';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/part/:id" element={<WordPartDetail />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/learn/:lessonId" element={<Learn />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/review" element={<Review />} />
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreProvider>
  );
}

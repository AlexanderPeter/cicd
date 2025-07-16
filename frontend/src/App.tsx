import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PollCreationPage from './pages/PollCreationPage';
import PollParticipationPage from './pages/PollParticipationPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/create" element={<PollCreationPage />} />
        <Route path="/polls/:code" element={<PollParticipationPage />} />
      </Routes>
    </Router>
  );
}

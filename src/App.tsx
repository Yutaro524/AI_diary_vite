// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Writing from './pages/Writing';
import EssayContent from './pages/Essay';
import Dashboard from './pages/Dashboard';
import Layout from './Layout';

const base = import.meta.env.VITE_BASE_URL;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={`${base}`} element={<Home />} />
          <Route path={`${base}writing`} element={<Writing />} />
        <Route path={`${base}essay/:id`} element={<EssayContent />} />
        <Route path={`${base}dashboard`} element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

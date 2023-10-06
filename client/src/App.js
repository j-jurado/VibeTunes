import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login.js';
import Mood from './components/mood.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mood" element={<Mood />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
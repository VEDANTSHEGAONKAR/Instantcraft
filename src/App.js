import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveRenderer from './components/LiveRenderer';
import NewLoginPage from './components/NewLoginPage';
import './styles/LiveRenderer.css';
import './styles/GlobalStyles.css';

function App() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true by default

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <Router>
      <div className="App" style={{ 
        height: '100vh', 
        overflow: 'hidden',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)'
      }}>
        <div style={{
          padding: '5px 20px'
        }}>
          <h1 style={{ 
            margin: '2px 0',
            color: 'var(--heading-color)',
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            InstantCraft
          </h1>
        </div>
        <Routes>
          <Route path="/login" element={<NewLoginPage />} />
          <Route path="/" element={<LiveRenderer toggleMode={toggleMode} isLightMode={isLightMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
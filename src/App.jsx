import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import EmailAssistant from './EmailAssistant';
import './App.css';

function OAuth2Callback() {
  const navigate = useNavigate();
  React.useEffect(() => {
    // After successful OAuth, redirect to /ask
    navigate('/email/ask', { replace: true });
  }, [navigate]);
  return <div>Logging in...</div>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Email Assistant</h1>
        </header>
        <div className="dashboard-layout">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/oauth2callback/" element={<OAuth2Callback />} />
            <Route path="/email/ask" element={<EmailAssistant />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

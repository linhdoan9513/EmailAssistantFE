import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/gmail/login/'; // Django endpoint for Gmail OAuth
  };

  return (
    <div className="card">
      <h2>Email Assistant Login</h2>
      <button onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login; 
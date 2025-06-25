import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  console.log("REACT_APP_API_BASE_URL =", process.env.REACT_APP_API_BASE_URL);

  useEffect(() => {
    // Check if user is already logged in
    const fetchUserEmail = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/profile/`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.email) {
          navigate('/ask');
        }
      } catch {}
    };
    fetchUserEmail();
  }, [navigate, API_BASE]);

  const handleLogin = () => {
    window.location.href = `${API_BASE}/gmail/login`; // Django endpoint for Gmail OAuth
  };

  return (
    <div className="card">
      <button onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login; 
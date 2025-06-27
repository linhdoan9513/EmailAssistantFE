import React, { useState, useEffect, useRef } from 'react';
import EmailList from './EmailList';
import './EmailAssistant.css';
import { useNavigate } from 'react-router-dom';

const EmailAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // [{role, content}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [emailsError, setEmailsError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchEmails = async () => {
      setEmailsLoading(true);
      setEmailsError('');
      try {
        const res = await fetch(`${API_BASE}/gmail/fetch/`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.threads)) {
          console.log("🚀 ~ fetchEmails ~ data:", data)
          setEmails(data.threads);
        } else {
          setEmailsError(data.error || 'Could not fetch emails.');
        }
      } catch {
        setEmailsError('Network error.');
      } finally {
        setEmailsLoading(false);
      }
    };
    fetchEmails();
  }, [API_BASE]);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/email/ask/`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && Array.isArray(data.history)) {
          setMessages(data.history);
        }
      } catch {}
    };
    fetchHistory();
  }, [API_BASE]);

  // Fetch user email on mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/profile/`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.email) {
          setUserEmail(data.email);
        }
      } catch {}
    };
    fetchUserEmail();
  }, [API_BASE]);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const response = await fetch(`${API_BASE}/email/ask/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.history)) {
        setMessages(data.history);
        setInput('');
      } else if (response.ok && data.answer) {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: data.answer }
        ]);
        setInput('');
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/gmail/logout/`, { credentials: 'include' });
    navigate('/');
  };

  return (
    <div className="ea-container">
      {/* Left: Email List */}
      <div className="ea-left">
        <EmailList emails={emails} loading={emailsLoading} error={emailsError} />
      </div>
      {/* Right: Chat/QA */}
      <div className="ea-right">
        <div className="ea-chat-header">
          {userEmail && (
            <div className="ea-user-info">
              <div className="ea-user-avatar">
                {userEmail[0]?.toUpperCase() || '?'}
              </div>
              <span className="ea-user-email">{userEmail}</span>
              <button onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
        <div className="ea-chat-area">
          <div className="ea-chat-thread">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ea-chat-bubble ${msg.role === 'user' ? 'ea-user' : 'ea-assistant'}`}> 
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        {answer && (
          <div className="answer-box">{answer}</div>
        )}
        <form className="ea-chat-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about your emails..."
            required
            className="ea-chat-input"
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()} className="ea-chat-send-btn">
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </form>
        {error && (
          <div className="ea-error">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EmailAssistant; 
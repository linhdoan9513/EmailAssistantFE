import React, { useState, useEffect } from 'react';
import EmailList from './EmailList';

const EmailAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [emailsError, setEmailsError] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      setEmailsLoading(true);
      setEmailsError('');
      try {
        const res = await fetch('http://localhost:8000/gmail/fetch/', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && Array.isArray(data.emails)) {
          setEmails(data.emails);
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const response = await fetch('http://localhost:8000/email/ask/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '70vh', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', minWidth: 900 }}>
      {/* Left: Email List */}
      <div style={{ flex: 1.2, background: '#f6f7fa', borderRight: '1px solid #e5e7eb', padding: '32px 0 32px 0', overflowY: 'auto' }}>
        <EmailList emails={emails} loading={emailsLoading} error={emailsError} />
      </div>
      {/* Right: Chat/QA */}
      <div style={{ flex: 2, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
        <h2 style={{ color: '#23272f', marginBottom: 24 }}>Email Assistant</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about your emails..."
            required
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 12 }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none' }}>
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </form>
        {answer && (
          <div className="answer-box" style={{ width: '100%', maxWidth: 420 }}>
            <strong>Answer:</strong>
            <div>{answer}</div>
          </div>
        )}
        {error && (
          <div className="error" style={{ width: '100%', maxWidth: 420 }}>{error}</div>
        )}
      </div>
    </div>
  );
};

export default EmailAssistant; 
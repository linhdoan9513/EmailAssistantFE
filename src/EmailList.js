import React from 'react';

function getInitial(email) {
  if (typeof email === 'object' && email.from) {
    // Try to extract the first letter from the sender's name or email
    const match = email.from.match(/[a-zA-Z]/);
    return match ? match[0].toUpperCase() : '?';
  }
  if (typeof email === 'string') {
    const match = email.match(/[a-zA-Z]/);
    return match ? match[0].toUpperCase() : '?';
  }
  return '?';
}

const EmailList = ({ emails, loading, error }) => {
  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ color: '#23272f', marginBottom: 12 }}>Your 100 Latest Emails</h3>
      {loading ? (
        <div>Loading emails...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div style={{ maxHeight: 300, overflowY: 'auto', background: '#f3f4f6', borderRadius: 8, padding: 12 }}>
          <ol style={{ textAlign: 'left', paddingLeft: 0, listStyle: 'none' }}>
            {emails.map((email, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 14, fontSize: 15, background: '#fff', borderRadius: 8, padding: '8px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  marginRight: 14
                }}>
                  {getInitial(email)}
                </div>
                <div style={{ flex: 1 }}>
                  {typeof email === 'object' ? (
                    <>
                      <div style={{ fontWeight: 600 }}>{email.from}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{email.snippet}</div>
                    </>
                  ) : (
                    <div>{email}</div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default EmailList; 
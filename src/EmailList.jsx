import React, { useState } from 'react';
import './EmailList.css';

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
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleToggle = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className="email-list-container">
      <h3 className="email-list-title">Your emails inbox</h3>
      {loading ? (
        <div className="email-list-scroll">
          <ol className="email-list-ol">
            {[...Array(10)].map((_, idx) => (
              <li key={idx} className="email-list-item skeleton">
                <div className="email-list-avatar skeleton">&nbsp;</div>
                <div className="email-list-content skeleton">
                  <div className="skeleton-line lg" />
                  <div className="skeleton-line sm" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="email-list-scroll">
          <ol className="email-list-ol">
            {emails.map((email, idx) => (
              <li key={idx} className="email-list-item">
                <div className="email-list-avatar">
                  {getInitial(email)}
                </div>
                <div className="email-list-content">
                  {typeof email === 'object' ? (
                    <>
                      <div className="email-list-from">{email.from}</div>
                      <div
                        className={`email-list-subject clickable${expandedIdx === idx ? ' expanded' : ''}`}
                        onClick={() => handleToggle(idx)}
                      >
                        {email.subject}
                      </div>
                      {expandedIdx === idx && (
                        <div className="email-list-preview expanded">
                          {email.preview}
                        </div>
                      )}
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
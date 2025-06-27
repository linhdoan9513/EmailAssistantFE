import React, { useState } from 'react';
import './EmailList.css';

function getInitial(email) {
  const match = email?.from?.match(/[a-zA-Z]/);
  return match ? match[0].toUpperCase() : '?';
}

const EmailList = ({ emails = [], loading, error }) => {
  const [expandedThreads, setExpandedThreads] = useState({});
  const [expandedEmails, setExpandedEmails] = useState({});

  const toggleThread = (threadId) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  const toggleEmail = (idx) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Hash function to assign color based on sender
  function getAvatarColorClass(email) {
    if (!email?.from) return 'avatar-color-0';
  const hash = [...email.from].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return `avatar-color-${hash % 10}`;
  }

  return (
    <div className="email-list-container">
      <h3 className="email-list-title">Your emails inbox</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <ul className="email-list-ol">
          {emails.map((thread, idx) => {
            const isThread = Array.isArray(thread.emails);
            const threadId = thread.thread_id || `single-${idx}`;
            const threadEmails = isThread ? thread.emails : [thread];

            return (
              <li key={threadId} className="email-thread">
                {threadEmails.length > 1 ? (
                  <>
                    <div className="email-list-item thread-parent" onClick={() => toggleThread(threadId)}>
                      <div className={`email-list-avatar ${getAvatarColorClass(threadEmails[0])}`}>{getInitial(threadEmails[0])}</div>
                      <div className="email-list-content">
                        <div className="email-list-subject-row">
                          <span className="expand-icon">
                            {expandedThreads[threadId] ? '▼' : '▶'}
                          </span>
                          <span className="email-list-from">{threadEmails[0].from}</span>
                        </div>
                        <div className="email-list-subject">{threadEmails[0].subject}</div>
                        {expandedThreads[threadId] && (
                          <div
                            className="email-list-preview expanded"
                            dangerouslySetInnerHTML={{ __html: threadEmails[0].snippet }}
                          />
                        )}
                      </div>
                    </div>
                    {expandedThreads[threadId] && (
                      <ul className="email-replies">
                        {threadEmails.slice(1).map((email, i) => (
                          <li key={i} className="email-list-item reply-item">
                            <div className={`email-list-avatar ${getAvatarColorClass(email)}`}>
                                {getInitial(email)}
                            </div>
                            <div className="email-list-content">
                              <div className="email-list-from">{email.from}</div>
                              {/* <div className="email-list-subject">{email.subject}</div> */}
                              <div
                                className="email-list-preview"
                                dangerouslySetInnerHTML={{ __html: email.snippet }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="email-list-item" onClick={() => toggleEmail(idx)}>
                    <div  className={`email-list-avatar ${getAvatarColorClass(threadEmails[0])}`}>{getInitial(threadEmails[0])}</div>
                    <div className="email-list-content">
                      <div className="email-list-from">{threadEmails[0].from}</div>
                      <div className="email-list-subject">{threadEmails[0].subject}</div>
                      {expandedEmails[idx] && (
                        <div
                          className="email-list-preview expanded"
                          dangerouslySetInnerHTML={{ __html: threadEmails[0].snippet }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EmailList;

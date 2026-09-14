import { useState, useEffect } from 'react';
import { config } from '../config';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (!config.rsvp.googleScriptUrl) {
          throw new Error('Google Script URL is not configured.');
        }

        // Fetch the data from the GET endpoint of the Google Script
        const res = await fetch(config.rsvp.googleScriptUrl);
        const data = await res.json();
        
        // Assuming data is a 2D array: [[Timestamp, Name, Message], [row2], ...]
        // We'll skip the first row if it contains headers
        const parsedResponses = data.map(row => ({
          timestamp: new Date(row[0]).toLocaleDateString() + ' ' + new Date(row[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          name: row[1],
          message: row[2]
        })).filter(r => r.name !== 'Name'); // filter out header if present

        // Sort newest first
        parsedResponses.reverse();
        
        setResponses(parsedResponses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <header className="admin-header">
          <h1 className="admin-title">RSVP Responses</h1>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-value">{responses.length}</span>
              <span className="stat-label">Total Responses</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading responses...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <p>Error loading data: {error}</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="admin-empty">
            <p>No RSVPs yet. They will appear here when guests submit the form.</p>
          </div>
        ) : (
          <div className="responses-grid">
            {responses.map((rsvp, idx) => (
              <div key={idx} className="response-card">
                <div className="response-header">
                  <h3 className="response-name">{rsvp.name}</h3>
                  <span className="response-date">{rsvp.timestamp}</span>
                </div>
                {rsvp.message && (
                  <div className="response-message">
                    <p>"{rsvp.message}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

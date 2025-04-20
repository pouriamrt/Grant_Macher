import React, { useEffect, useState } from 'react';
import { fetchMatches, sendMatchEmail } from '../services/api';

const MatchResults = () => {
  const [matches, setMatches] = useState([]);
  const [sendingMatchId, setSendingMatchId] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch match results:', error);
      }
    };

    loadMatches();
  }, []);

  const handleSendEmail = async (match) => {
    try {
      setSendingMatchId(match.id); // <-- mark which match is being sent
      await sendMatchEmail(match.id);
      alert(`Email sent to ${match.researcher_name}!`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    } finally {
      setSendingMatchId(null); // <-- reset after sending
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Match Results</h1>

      {matches.length === 0 ? (
        <p className="text-gray-600">No matches found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{match.researcher_name}</h2>
              <p className="text-gray-500">Matched to Grant:</p>
              <p className="text-blue-600 font-semibold">{match.grant_title}</p>
              <p className="text-gray-500">Match Score: {match.match_score}</p>
              <p className="text-gray-500">Reason: {match.reason}</p>

              <button
                onClick={() => handleSendEmail(match)}
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
                disabled={sendingMatchId === match.id}
              >
                {sendingMatchId === match.id ? 'Sending...' : 'Email it to the Scientist'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchResults;

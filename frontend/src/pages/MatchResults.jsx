import React, { useEffect, useState } from 'react';
import { fetchMatches, sendMatchEmail, setMatchFeedback } from '../services/api';

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
      setSendingMatchId(match.id);
      await sendMatchEmail(match.id);
      alert(`Email sent to ${match.researcher_name}!`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    } finally {
      setSendingMatchId(null);
    }
  };

  const handleFeedback = async (matchId, feedback) => {
    try {
      await setMatchFeedback(matchId, feedback);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, feedback } : m
        )
      );
    } catch (error) {
      alert('Failed to set feedback');
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">Match Results</h1>

      {matches.length === 0 ? (
        <p className="text-gray-600 text-center">No matches found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white p-8 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold mb-2 text-blue-700 text-center">{match.researcher_name}</h2>
              <p className="text-gray-500 text-center">Matched to Grant:</p>
              <p className="text-blue-600 font-semibold text-center mb-2">{match.grant_title}</p>
              <p className="text-gray-500 text-center">Match Score: <span className="font-bold text-blue-700">{match.match_score}</span></p>
              <p className="text-gray-500 text-center mb-4">Reason: {match.reason}</p>

              <div className="flex space-x-4 mt-2 mb-4">
                <button
                  onClick={() => handleFeedback(match.id, 'up')}
                  className={`rounded-full p-3 text-3xl shadow-md transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-green-300 hover:scale-110 hover:bg-green-50 ${match.feedback === 'up' ? 'bg-green-100 border-green-500 text-green-600 scale-110 animate-pulse' : 'bg-white border-gray-200 text-gray-400'}`}
                  title="Thumbs Up"
                  aria-label="Thumbs Up"
                >👍</button>
                <button
                  onClick={() => handleFeedback(match.id, 'down')}
                  className={`rounded-full p-3 text-3xl shadow-md transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-red-300 hover:scale-110 hover:bg-red-50 ${match.feedback === 'down' ? 'bg-red-100 border-red-500 text-red-600 scale-110 animate-pulse' : 'bg-white border-gray-200 text-gray-400'}`}
                  title="Thumbs Down"
                  aria-label="Thumbs Down"
                >👎</button>
              </div>

              <button
                onClick={() => handleSendEmail(match)}
                className="mt-2 px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg shadow-lg transition-all duration-200 font-semibold text-lg w-full"
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

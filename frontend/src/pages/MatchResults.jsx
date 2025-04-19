import React, { useEffect, useState } from 'react';
import { fetchMatches } from '../services/api';

const MatchResults = () => {
  const [matches, setMatches] = useState([]);

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

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Match Results</h1>

      {matches.length === 0 ? (
        <p className="text-gray-600">No matches found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{match.researcher_name}</h2>
              <p className="text-gray-500">Matched to Grant:</p>
              <p className="text-blue-600 font-semibold">{match.grant_title}</p>
              <p className="text-gray-500">Match Score: {match.match_score}</p>
              <p className="text-gray-500">Reason: {match.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchResults;

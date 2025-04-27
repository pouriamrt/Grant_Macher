import React, { useEffect, useState } from 'react';
import { fetchResearchers } from '../services/api';
import { Link } from 'react-router-dom';

const Researchers = () => {
  const [researchers, setResearchers] = useState([]);

  useEffect(() => {
    const loadResearchers = async () => {
      try {
        const data = await fetchResearchers();
        setResearchers(data);
      } catch (error) {
        console.error('Failed to fetch researchers:', error);
      }
    };

    loadResearchers();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">Researchers</h1>

      {researchers.length === 0 ? (
        <p className="text-gray-600 text-center">No researchers found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {researchers.map((researcher) => (
            <Link
              key={researcher.id}
              to={`/researchers/${researcher.id}`}
              className="bg-white p-8 rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <h2 className="text-2xl font-semibold text-blue-700 text-center mb-2">{researcher.name}</h2>
              <p className="text-gray-500 text-center">Researcher ID: <span className="font-bold text-blue-700">{researcher.id}</span></p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Researchers;

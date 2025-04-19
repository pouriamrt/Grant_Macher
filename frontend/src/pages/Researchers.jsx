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
      <h1 className="text-3xl font-bold mb-6">Researchers</h1>

      {researchers.length === 0 ? (
        <p className="text-gray-600">No researchers found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchers.map((researcher) => (
            <Link
              key={researcher.id}
              to={`/researchers/${researcher.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
            >
              <h2 className="text-xl font-semibold">{researcher.name}</h2>
              <p className="text-gray-500 mt-2">Researcher ID: {researcher.id}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Researchers;

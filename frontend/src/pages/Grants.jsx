import React, { useEffect, useState } from 'react';
import { fetchGrants } from '../services/api';
import { Link } from 'react-router-dom';

const Grants = () => {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const loadGrants = async () => {
      try {
        const data = await fetchGrants();
        setGrants(data);
      } catch (error) {
        console.error('Failed to fetch grants:', error);
      }
    };

    loadGrants();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Grants</h1>

      {grants.length === 0 ? (
        <p className="text-gray-600">No grants found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grants.map((grant) => (
            <Link
              key={grant.id}
              to={`/grants/${grant.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
            >
              <h2 className="text-xl font-semibold">{grant.title}</h2>
              <p className="text-gray-500 mt-2">Grant ID: {grant.id}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Grants;

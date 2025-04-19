import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGrantDetails } from '../services/api';

const GrantDetails = () => {
  const { id } = useParams();
  const [grant, setGrant] = useState(null);

  useEffect(() => {
    const loadGrant = async () => {
      try {
        const data = await fetchGrantDetails(id);
        setGrant(data);
      } catch (error) {
        console.error('Failed to fetch grant details:', error);
      }
    };

    loadGrant();
  }, [id]);

  if (!grant) {
    return <p className="text-center mt-10 text-gray-600">Loading grant details...</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Grant Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold">{grant.title}</h2>
        <p className="text-gray-600 mt-2">Grant ID: {grant.id}</p>
        <p className="text-gray-600 mt-2">Grant Description: {grant.description}</p>
        <p className="text-gray-600 mt-2">Grant Source: {grant.source}</p>
        <p className="text-gray-600 mt-2">Grant Amount: {grant.amount}</p>
        <p className="text-gray-600 mt-2">Grant Deadline: {grant.deadline}</p>
      </div>
    </div>
  );
};

export default GrantDetails;

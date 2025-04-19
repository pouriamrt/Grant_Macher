import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchResearcherDetails } from '../services/api';

const ResearcherDetails = () => {
  const { id } = useParams();
  const [researcher, setResearcher] = useState(null);

  useEffect(() => {
    const loadResearcher = async () => {
      try {
        const data = await fetchResearcherDetails(id);
        setResearcher(data);
      } catch (error) {
        console.error('Failed to fetch researcher details:', error);
      }
    };

    loadResearcher();
  }, [id]);

  if (!researcher) {
    return <p className="text-center mt-10 text-gray-600">Loading researcher details...</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Researcher Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold">{researcher.name}</h2>
        <p className="text-gray-600 mt-2">Researcher ID: {researcher.id}</p>
        <p className="text-gray-600 mt-2">Researcher Position: {researcher.position}</p>
        <p className="text-gray-600 mt-2">Researcher Program: {researcher.program}</p>
        <p className="text-gray-600 mt-2">Researcher Email: {researcher.email}</p>
        <p className="text-gray-600 mt-2">Researcher Interests: {researcher.keywords}</p>
      </div>
    </div>
  );
};

export default ResearcherDetails;

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { fetchResearchers, scrapeNIHGrants, scrapeCIHRGrants, matchSpecificResearcher, matchAllResearchers } from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [researcherName, setResearcherName] = useState('');

  const handleScrapeNIH = async () => {
    setLoading(true);
    try {
      await scrapeNIHGrants();
      toast.success('NIH Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape NIH grants.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeCIHR = async () => {
    setLoading(true);
    try {
      await scrapeCIHRGrants();
      toast.success('CIHR Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape CIHR grants.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetResearchers = async () => {
    setLoading(true);
    try {
      const data = await fetchResearchers();
      toast.success(`Fetched ${data.length} researchers!`);
    } catch (error) {
      toast.error('Failed to fetch researchers.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSpecificResearcher = async () => {
    if (!researcherName.trim()) {
      toast.error('Please enter a researcher name.');
      return;
    }
    setLoading(true);
    try {
      await matchSpecificResearcher(researcherName.trim());
      toast.success(`Matches generated for ${researcherName}!`);
      setResearcherName('');
    } catch (error) {
      toast.error('Failed to generate matches.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAllResearchers = async () => {
    setLoading(true);
    try {
      await matchAllResearchers();
      toast.success('Matches generated for all researchers!');
    } catch (error) {
      toast.error('Failed to generate matches.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Welcome to Grant Matcher</h1>
      <p className="mb-6 text-gray-700">Use the quick actions below or navigate using the menu.</p>

      <div className="flex flex-col gap-4">

        <button
          onClick={handleScrapeNIH}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Scrape NIH Grants'}
        </button>

        <button
          onClick={handleScrapeCIHR}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Scrape CIHR Grants'}
        </button>

        <button
          onClick={handleGetResearchers}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Get Researchers'}
        </button>

        {/* Input for matching a specific researcher */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            value={researcherName}
            onChange={(e) => setResearcherName(e.target.value)}
            placeholder="Enter Researcher Name"
            className="border p-2 rounded w-full sm:w-2/3"
          />
          <button
            onClick={handleMatchSpecificResearcher}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 w-full sm:w-1/3"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Match This Researcher'}
          </button>
        </div>

        {/* Button to match all researchers */}
        <button
          onClick={handleMatchAllResearchers}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Match All Researchers'}
        </button>

      </div>
    </div>
  );
};

export default Home;

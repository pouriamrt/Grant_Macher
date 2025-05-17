import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  fetchResearchers, 
  scrapeNIHGrants, 
  scrapeCIHRGrants, 
  matchSpecificResearcher, 
  matchAllResearchers, 
  sendAllMatchesEmail,
  scrapeCBRFGrants,
  scrapeTohamoGrants,
  scrapeOntarioHealthGrants,
  scrapeStemCellNetworkGrants
} from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [researcherName, setResearcherName] = useState('');
  const [threshold, setThreshold] = useState('medium');
  const [similarityThreshold, setSimilarityThreshold] = useState('medium');

  const thresholdMap = { low: 0.3, medium: 0.5, high: 0.7 };
  const similarityMap = { low: 0.2, medium: 0.3, high: 0.5 };

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

  const handleScrapeCBRF = async () => {
    setLoading(true);
    try {
      await scrapeCBRFGrants();
      toast.success('CBRF Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape CBRF grants.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeTohamo = async () => {
    setLoading(true);
    try {
      await scrapeTohamoGrants();
      toast.success('Tohamo Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape Tohamo grants.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeOntarioHealth = async () => {
    setLoading(true);
    try {
      await scrapeOntarioHealthGrants();
      toast.success('Ontario Health Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape Ontario Health grants.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeStemCellNetwork = async () => {
    setLoading(true);
    try {
      await scrapeStemCellNetworkGrants();
      toast.success('Stem Cell Network Grants scraped successfully!');
    } catch (error) {
      toast.error('Failed to scrape Stem Cell Network grants.');
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
      await matchSpecificResearcher(
        researcherName.trim(),
        thresholdMap[threshold],
        similarityMap[similarityThreshold]
      );
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
      await matchAllResearchers(
        thresholdMap[threshold],
        similarityMap[similarityThreshold]
      );
      toast.success('Matches generated for all researchers!');
    } catch (error) {
      toast.error('Failed to generate matches.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAllMatchesEmail = async () => {
    setEmailSending(true);
    try {
      await sendAllMatchesEmail();
      toast.success('Emails sent to all researchers!');
    } catch (error) {
      toast.error('Failed to send emails.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-start py-10 px-2">
      <Toaster />
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-blue-100 shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-center text-blue-800 drop-shadow">Welcome to Grant Matcher</h1>
        <p className="mb-8 text-gray-700 text-center text-lg">Use the quick actions below and navigate using the menu.</p>

        <div className="flex flex-col gap-5 w-full">

          <button
            onClick={handleScrapeNIH}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-blue-500 hover:to-blue-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape NIH Grants'}
          </button>

          <button
            onClick={handleScrapeCIHR}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape CIHR Grants'}
          </button>

          <button
            onClick={handleScrapeCBRF}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape CBRF Grants'}
          </button>

          <button
            onClick={handleScrapeTohamo}
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-orange-500 hover:to-orange-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape Tohamo Grants'}
          </button>

          <button
            onClick={handleScrapeOntarioHealth}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape Ontario Health Grants'}
          </button>

          <button
            onClick={handleScrapeStemCellNetwork}
            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-pink-500 hover:to-pink-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Scrape Stem Cell Network Grants'}
          </button>
          
          <button
            onClick={handleGetResearchers}
            className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-purple-500 hover:to-purple-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Get Researchers'}
          </button>

          {/* Beautiful Threshold Sliders Card */}
          <div className="bg-blue-50 rounded-xl shadow-inner p-6 flex flex-col sm:flex-row items-center justify-center gap-8 border border-blue-100">
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-700 mb-2">Match Score Threshold</label>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={['low','medium','high'].indexOf(threshold)}
                onChange={e => setThreshold(['low','medium','high'][parseInt(e.target.value)])}
                className="w-40 accent-indigo-500 h-2 rounded-lg appearance-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex justify-between w-40 mt-1 text-xs text-gray-500">
                <span className={threshold==='low' ? 'font-bold text-indigo-600' : ''}>Low</span>
                <span className={threshold==='medium' ? 'font-bold text-indigo-600' : ''}>Medium</span>
                <span className={threshold==='high' ? 'font-bold text-indigo-600' : ''}>High</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-700 mb-2">Similarity Threshold</label>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={['low','medium','high'].indexOf(similarityThreshold)}
                onChange={e => setSimilarityThreshold(['low','medium','high'][parseInt(e.target.value)])}
                className="w-40 accent-teal-500 h-2 rounded-lg appearance-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <div className="flex justify-between w-40 mt-1 text-xs text-gray-500">
                <span className={similarityThreshold==='low' ? 'font-bold text-teal-600' : ''}>Low</span>
                <span className={similarityThreshold==='medium' ? 'font-bold text-teal-600' : ''}>Medium</span>
                <span className={similarityThreshold==='high' ? 'font-bold text-teal-600' : ''}>High</span>
              </div>
            </div>
          </div>

          {/* Input for matching a specific researcher */}
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
            <input
              type="text"
              value={researcherName}
              onChange={(e) => setResearcherName(e.target.value)}
              placeholder="Enter Researcher Name"
              className="border p-3 rounded-lg w-full sm:w-2/3 shadow focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
            />
            <button
              onClick={handleMatchSpecificResearcher}
              className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-indigo-500 hover:to-indigo-700 transition-all duration-200 text-lg font-semibold w-full sm:w-1/3 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Match This Researcher'}
            </button>
          </div>

          {/* Button to match all researchers */}
          <button
            onClick={handleMatchAllResearchers}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Match All Researchers'}
          </button>

          {/* NEW: Button to email all matches */}
          <button
            onClick={handleSendAllMatchesEmail}
            className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-teal-500 hover:to-teal-700 transition-all duration-200 text-lg font-semibold disabled:opacity-50"
            disabled={emailSending}
          >
            {emailSending ? 'Sending Emails...' : 'Send Emails to All Researchers'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;

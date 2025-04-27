import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Researchers
export const fetchResearchers = async () => {
  const response = await axios.get(`${API_BASE_URL}/researchers`);
  return response.data;
};

export const fetchResearcherDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/researchers/${id}`);
  return response.data;
};

// Grants
export const fetchGrants = async () => {
  const response = await axios.get(`${API_BASE_URL}/grants`);
  return response.data;
};

export const fetchGrantDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/grants/${id}`);
  return response.data;
};

// Matches
export const fetchMatches = async () => {
  const response = await axios.get(`${API_BASE_URL}/matches`);
  return response.data;
};

// Emailing a single match
export const sendMatchEmail = async (matchId) => {
  const formData = new FormData();
  formData.append('match_id', matchId);

  const response = await axios.post(`${API_BASE_URL}/send_matches`, formData);
  return response.data;
};

// Emailing all matches
export const sendAllMatchesEmail = async () => {
  const response = await axios.post(`${API_BASE_URL}/send_matches`);
  return response.data;
};

// Matching
export const matchSpecificResearcher = async (researcherName, threshold, similarityThreshold) => {
  const formData = new FormData();
  formData.append('researcher_name', researcherName);
  formData.append('threshold', threshold);
  formData.append('similarity_threshold', similarityThreshold);

  const response = await axios.post(`${API_BASE_URL}/generate_matches`, formData);
  return response.data;
};

export const matchAllResearchers = async (threshold, similarityThreshold) => {
  const formData = new FormData();
  formData.append('threshold', threshold);
  formData.append('similarity_threshold', similarityThreshold);

  const response = await axios.post(`${API_BASE_URL}/generate_matches`, formData);
  return response.data;
};

// Scraping
export const scrapeNIHGrants = async () => {
  const response = await axios.post(`${API_BASE_URL}/scrape_nih`);
  return response.data;
};

export const scrapeCIHRGrants = async () => {
  const response = await axios.post(`${API_BASE_URL}/scrape_cihr`);
  return response.data;
};

export const setMatchFeedback = async (matchId, feedback) => {
  const response = await axios.post(
    `${API_BASE_URL}/matches/${matchId}/feedback`,
    { feedback }
  );
  return response.data;
};

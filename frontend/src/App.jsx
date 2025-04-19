// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Researchers from './pages/Researchers';
import ResearcherDetails from './pages/ResearcherDetails';
import Grants from './pages/Grants';
import GrantDetails from './pages/GrantDetails';
import MatchResults from './pages/MatchResults';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/researchers" element={<Researchers />} />
          <Route path="/researchers/:id" element={<ResearcherDetails />} />
          <Route path="/grants" element={<Grants />} />
          <Route path="/grants/:id" element={<GrantDetails />} />
          <Route path="/matches" element={<MatchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

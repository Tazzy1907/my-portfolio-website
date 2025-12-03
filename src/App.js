import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import ScrollingBackground from './components/ScrollingBackground';

function App() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Router>
        {/* Persistent scrolling background - renders once, stays across all pages */}
        <ScrollingBackground />
        
        {/* Page routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

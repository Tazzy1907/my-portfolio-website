import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import NotFound from './pages/NotFound';
import ScrollingBackground from './components/ScrollingBackground';

function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#1E1E1E]">
      <Router>
        {/* Persistent scrolling background - renders once, stays across all pages */}
        <ScrollingBackground />
        
        {/* Page routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

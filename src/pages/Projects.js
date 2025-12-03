import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, FileText, Github } from 'lucide-react';
import NavButton from '../components/NavButton';
import '../styles/entranceAnimations.css';

// Project data - customize with your actual projects
const PROJECTS_DATA = [
  {
    title: "CharacterCompass",
    subtitle: "Warwick Hackathon '25 Winner",
    emoji: "📕",
    description: "An evolving, real-time character profile generator, powered by AI and designed for authors. This application stays up-to-date with stories as they're written, creating in-depth and personalised profiles for main and side characters within the story.",
    tags: ["LangChain", "Retrieval-Augmented Generation", "Python", "Flutter", "Full-Stack"],
    github: "https://devpost.com/software/charactercompass",
    color: "#F59E0B"
  },
  {
    title: "Final Year Project",
    subtitle: "Work in Progress",
    emoji: "🎓",
    description: "A mobile application to recommend internships and job listings to STEM students, using a hybrid recommender system coupled with novel AI-powered conversational refinement.",
    tags: ["LangChain", "Hybrid Recommender System", "Python", "Full-Stack"],
    github: "https://github.com/Tazzy1907/CS139-Coursework-EventByte",
    color: "#06B6D4"
  },
  {
    title: "EventByte",
    subtitle: "Web Development Coursework",
    emoji: "🎉",
    description: "A web application for listing and managing events, complete with both admin and user functionality.",
    tags: ["Flask", "Python", "SQLAlchemy", "Full-Stack"],
    github: "https://github.com/Tazzy1907/CS139-Coursework-EventByte",
    color: "#10B981"
  },
  {
    title: "Restaurant Ordering App",
    subtitle: "Summer Project",
    emoji: "🍔",
    description: "Mobile application to replicate and optimise the ordering system for Loungers, a restaurant chain in the UK. Though unfinished, this project was a first dive into the world of cross-platform mobile development.",
    tags: ["React Native", "JavaScript", "Full-Stack"],
    // github: "https://github.com/yourusername/financialflow",
    color: "#8B5CF6"
  },
  {
    title: "Multi-Threaded Packet Sniffing Tool",
    subtitle: "OS & Networks Coursework",
    emoji: "🔍",
    description: "A multi-threaded packet sniffing tool built in C to detect malicious intrusions, defined as TCP SYN packets, ARP response packets, and HTTP requests to blacklisted URLs.",
    tags: ["C", "Packet Sniffing", "Multi-threading", "Back-End"],
    github: "https://github.com/Tazzy1907/CS241-Coursework",
    color: "#1DB954"
  },
  {
    title: "Graphics Rendering Engine",
    subtitle: "A-Level CS Coursework",
    emoji: "🎮",
    description: "Lightweight graphics rendering engine using the 2D PixelGameEngine framework. Supports permanent upload and storage of object files alongside real-time rendering. Tools include rotation, scaling, translation, and wireframe view.",
    tags: ["C++", "Qt", "Graphics", "Full-Stack"],
    github: "https://github.com/Tazzy1907/QTGraphicsImplementation",
    color: "#EF4444"
  }
];

export default function Projects() {
  return (
    <div className="relative h-screen w-full overflow-hidden font-mono flex flex-col">

      {/* Top Header - Fixed */}
      <header className="flex-shrink-0 z-20 flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 gap-y-3">
        {/* Name/Logo - links to home (far left) */}
        <Link 
          to="/" 
          className="text-lg sm:text-xl font-bold text-white hover:text-[#E8B4A0] transition-colors animate-slide-right"
          style={{ opacity: 0, animationDelay: '0.1s' }}
        >
          Taz <span className="text-[#E8B4A0]">Siriwardena</span>
        </Link>

        {/* Page Title (center) - positioned relative to viewport, hidden on very small screens */}
        <h1 
          className="hidden sm:block fixed top-4 sm:top-6 left-0 right-0 text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight animate-slide-up pointer-events-none"
          style={{ opacity: 0, animationDelay: '0.15s' }}
        >
          Projects<span className="text-[#2DD4BF]">.</span>
        </h1>
        
        {/* Nav Buttons (far right) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/" 
            className="hidden sm:block text-[#E8B4A0] hover:text-white transition-colors text-sm animate-fade-in"
            style={{ opacity: 0, animationDelay: '0.2s' }}
          >
            ← Back to Home
          </Link>
          <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.25s' }}>
            <NavButton icon={Terminal} label="Projects" to="/projects" color="teal" active />
          </div>
          <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
            <NavButton icon={FileText} label="Experience" to="/experience" color="purple" />
          </div>
        </div>
      </header>

      {/* Mobile Page Title - shown only on very small screens */}
      <h1 
        className="sm:hidden text-center text-2xl font-bold text-white tracking-tight animate-slide-up px-4 -mt-2 mb-2"
        style={{ opacity: 0, animationDelay: '0.15s' }}
      >
        Projects<span className="text-[#2DD4BF]">.</span>
      </h1>

      {/* Main Content - Scrollable area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-16 pt-4 sm:pt-8 pb-6 sm:pb-8">
        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}

// 3D Tilt Project Card Component
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [entranceComplete, setEntranceComplete] = useState(false);
  const animationRef = useRef(null);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const currentRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });

  // Mark entrance animation as complete after delay
  const staggerDelay = 0.3 + (index * 0.07);
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, (staggerDelay + 0.5) * 1000); // animation delay + duration
    return () => clearTimeout(timer);
  }, [staggerDelay]);

  const animate = () => {
    // Smooth interpolation (lerp) for buttery movement
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const smoothFactor = 0.08; // Lower = smoother but slower
    
    currentRef.current.rotateX = lerp(currentRef.current.rotateX, targetRef.current.rotateX, smoothFactor);
    currentRef.current.rotateY = lerp(currentRef.current.rotateY, targetRef.current.rotateY, smoothFactor);
    currentRef.current.scale = lerp(currentRef.current.scale, targetRef.current.scale, smoothFactor);
    
    const { rotateX, rotateY, scale } = currentRef.current;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseEnter = () => {
    targetRef.current.scale = 1.02;
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 8 degrees - reduced for smoother feel)
    targetRef.current.rotateX = ((y - centerY) / centerY) * -8;
    targetRef.current.rotateY = ((x - centerX) / centerX) * 8;
    
    // Update glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.1 });
  };

  const handleMouseLeave = () => {
    targetRef.current = { rotateX: 0, rotateY: 0, scale: 1 };
    setGlare({ x: 50, y: 50, opacity: 0 });
    
    // Keep animating until we're back to center
    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }, 500);
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden will-change-transform ${!entranceComplete ? 'animate-card' : ''}`}
      style={{ 
        transform: entranceComplete ? transform : undefined,
        transformStyle: 'preserve-3d',
        opacity: entranceComplete ? 1 : 0,
        animationDelay: !entranceComplete ? `${staggerDelay}s` : undefined
      }}
    >
      {/* Card background */}
      <div className="relative bg-[#2a2a2a]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full">
        {/* Glare effect */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          }}
        />
        
        {/* GitHub link - larger hit area for easier clicking */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-20"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
          style={{ transform: 'translateZ(20px)' }} // Pop out slightly in 3D space
        >
          <Github size={18} className="text-white/70 hover:text-white transition-colors" />
        </a>

        {/* Content */}
        <div className="relative z-10">
          {/* Title with emoji */}
          <h3 className="text-xl font-bold text-white pr-12">
            {project.title} {project.emoji}
          </h3>
          
          {/* Subtitle if exists */}
          {project.subtitle && (
            <p className="text-sm text-white/50 mt-1">({project.subtitle})</p>
          )}

          {/* Description */}
          <p className="mt-4 text-white/70 text-sm leading-relaxed line-clamp-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2.5 py-1 rounded-md transition-colors"
                style={{ 
                  color: project.color,
                  backgroundColor: `${project.color}20`
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
          style={{ backgroundColor: project.color }}
        />
      </div>
    </div>
  );
};


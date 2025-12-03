import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, FileText, Linkedin, Github, Mail } from 'lucide-react';
import NavButton from '../components/NavButton';

// Text content for typing animations
const TITLE_TEXT = "Hey, I'm Taz";
const BIO_TEXT = "A Computer Science student specialising in AI engineering.";

export default function Home() {
  // Typing animation states
  const [titleText, setTitleText] = useState('');
  const [bioText, setBioText] = useState('');
  const [titleComplete, setTitleComplete] = useState(false);
  const [bioComplete, setBioComplete] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  const titleIndexRef = useRef(0);
  const bioIndexRef = useRef(0);

  // Title typing animation
  useEffect(() => {
    if (titleIndexRef.current < TITLE_TEXT.length) {
      const timeout = setTimeout(() => {
        setTitleText(TITLE_TEXT.slice(0, titleIndexRef.current + 1));
        titleIndexRef.current += 1;
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      setTitleComplete(true);
    }
  }, [titleText]);

  // Bio typing animation (starts after title is complete)
  useEffect(() => {
    if (titleComplete && bioIndexRef.current < BIO_TEXT.length) {
      const timeout = setTimeout(() => {
        setBioText(BIO_TEXT.slice(0, bioIndexRef.current + 1));
        bioIndexRef.current += 1;
      }, 40);
      return () => clearTimeout(timeout);
    } else if (titleComplete && bioIndexRef.current >= BIO_TEXT.length) {
      setBioComplete(true);
    }
  }, [titleComplete, bioText]);

  // Show contact section after bio is complete
  useEffect(() => {
    if (bioComplete) {
      const timeout = setTimeout(() => {
        setShowContact(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [bioComplete]);

  // Function to render title with "Taz" highlighted
  const renderTitle = () => {
    const tazIndex = TITLE_TEXT.indexOf('Taz');
    const currentLength = titleText.length;
    
    if (currentLength <= tazIndex) {
      return <>{titleText}</>;
    } else {
      const beforeTaz = titleText.slice(0, tazIndex);
      const tazPart = titleText.slice(tazIndex, Math.min(currentLength, tazIndex + 3));
      return (
        <>
          {beforeTaz}
          <span className="text-[#E8B4A0]">{tazPart}</span>
        </>
      );
    }
  };

  // Function to render bio with highlighted words
  const renderBio = () => {
    const text = bioText;
    const highlights = [
      { phrase: 'Computer Science', start: BIO_TEXT.indexOf('Computer Science') },
      { phrase: 'AI engineering', start: BIO_TEXT.indexOf('AI engineering') }
    ];
    
    let result = [];
    let lastIndex = 0;
    
    highlights.forEach(({ phrase, start }, idx) => {
      const end = start + phrase.length;
      
      if (lastIndex < start && lastIndex < text.length) {
        result.push(
          <span key={`before-${idx}`}>
            {text.slice(lastIndex, Math.min(start, text.length))}
          </span>
        );
      }
      
      if (text.length > start) {
        result.push(
          <span key={`highlight-${idx}`} className="text-[#E8B4A0]">
            {text.slice(start, Math.min(end, text.length))}
          </span>
        );
      }
      
      lastIndex = end;
    });
    
    if (lastIndex < text.length) {
      result.push(<span key="remaining">{text.slice(lastIndex)}</span>);
    }
    
    return result;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-mono text-white">
      {/* MAIN CONTENT LAYER */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-6 md:px-12 lg:px-24">
        
        {/* HEADER SECTION */}
        <header className="mt-4 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl font-mono min-h-[1.2em]">
            {renderTitle()}
            <span className="typing-cursor">|</span>
          </h1>
          
          {/* NAVIGATION BUTTONS - appear after title */}
          <nav className={`mt-6 flex flex-wrap justify-center gap-4 transition-all duration-500 ${titleComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NavButton icon={Terminal} label="Projects" to="/projects" color="teal" size="large" />
            <NavButton icon={FileText} label="Experience" to="/experience" color="purple" size="large" />
          </nav>
        </header>

        {/* HERO CONTENT - Split Layout */}
        <main className="mt-10 grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-10">
          
          {/* LEFT COLUMN: Bio & Contact */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className={`text-xl font-medium leading-relaxed text-white md:text-2xl lg:text-3xl font-mono min-h-[3.5em] transition-opacity duration-300 ${titleComplete ? 'opacity-100' : 'opacity-0'}`}>
                {renderBio()}
              </p>

              {/* About Me Section - fades in after bio */}
              <div className={`transition-all duration-700 ${showContact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-lg text-white/70 leading-relaxed font-mono">
                  I'm passionate about utilising agentic systems to solve and optimise real-world problems. 
                  I'm currently finishing my final year of university, exploring the intersection of artificial intelligence and recommender systems.
                  <br /><br />
                  When I'm not coding, you'll find me bartending on weekends, or attempting to model cars using Blender.
                </p>
              </div>
            </div>

            {/* Contact Section - fades in after bio */}
            <div className={`flex flex-col gap-3 transition-all duration-700 ${showContact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
              <h3 className="text-base font-bold text-white font-mono">Get in touch:</h3>
              <div className="flex flex-col gap-2">
                <ContactLink 
                  icon={Linkedin} 
                  label="Tanaz Siriwardena" 
                  href="https://www.linkedin.com/in/tanaz-siriwardena-bb4753237/" 
                  iconBg="bg-[#0A66C2]"
                  delay={0}
                  show={showContact}
                />
                <ContactLink 
                  icon={Github} 
                  label="Tazzy1907" 
                  href="https://github.com/Tazzy1907" 
                  iconBg="bg-[#6e5494]"
                  delay={100}
                  show={showContact}
                />
                <ContactLink 
                  icon={Mail} 
                  label="tanlinsir@gmail.com" 
                  href="mailto:tanlinsir@gmail.com" 
                  iconBg="bg-[#EA4335]"
                  delay={200}
                  show={showContact}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Video/Illustration */}
          <div className={`relative w-full aspect-[4/3] overflow-hidden rounded-2xl transition-all duration-700 bg-[#2a2a2a] ${titleComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <video 
              src="/home_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>

        </main>
      </div>

      {/* Typing cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typing-cursor {
          animation: blink 1s infinite;
          color: #E8B4A0;
          font-weight: 400;
          margin-left: 2px;
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const ContactLink = ({ icon: Icon, label, href, iconBg, delay, show }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-base font-medium text-white transition-all hover:text-[#E8B4A0] font-mono"
    style={{
      opacity: show ? 1 : 0,
      transform: show ? 'translateX(0)' : 'translateX(-20px)',
      transition: `all 0.4s ease ${delay}ms`
    }}
  >
    <div className={`flex h-7 w-7 items-center justify-center rounded ${iconBg}`}>
      <Icon size={16} className="text-white" />
    </div>
    {label}
  </a>
);

import React, { useState, useEffect } from 'react';

// Tech words to highlight in the background
const TECH_WORDS = [
  "UBS", "PYTHON", "JAVA", "SQL", "SQLITE", "C++", "REACT", "REACT NATIVE",
  "HTML", "CSS", "JAVASCRIPT", "LANGCHAIN", "LLAMAINDEX", "CHARACTERCOMPASS", "WARWICK"
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a row of characters with random tech words embedded.
 */
const generateRowData = (length = 80) => {
  const row = new Array(length).fill(null).map(() => ({
    char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
    highlight: false
  }));

  const numWords = Math.floor(Math.random() * 2) + 1;
  const usedRanges = [];
  const minGap = 3;

  for (let w = 0; w < numWords; w++) {
    const word = TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)];
    if (word.length > length) continue;
    
    let placed = false;
    for (let attempt = 0; attempt < 20 && !placed; attempt++) {
      const startIdx = Math.floor(Math.random() * (length - word.length));
      const endIdx = startIdx + word.length;
      
      const overlaps = usedRanges.some(([usedStart, usedEnd]) => {
        return !(endIdx + minGap < usedStart || startIdx > usedEnd + minGap);
      });
      
      if (!overlaps) {
        for (let i = 0; i < word.length; i++) {
          row[startIdx + i] = { char: word[i], highlight: true };
        }
        usedRanges.push([startIdx, endIdx]);
        placed = true;
      }
    }
  }
  return row;
};

// Memoized row component for performance
const ScrollingRow = React.memo(({ rowData, duration, delay }) => (
  <div 
    className="flex w-full select-none animate-scroll"
    style={{ animationDuration: `${duration}s`, animationDelay: `-${delay}s` }}
  >
    <RowText data={rowData} />
    <RowText data={rowData} />
  </div>
));

const RowText = React.memo(({ data }) => (
  <div className="flex w-1/2 min-w-max justify-around whitespace-nowrap px-4 text-xl sm:text-2xl font-bold tracking-widest">
    {data.map((item, idx) => (
      <span 
        key={idx} 
        className={`mx-1 transition-colors duration-300 ${
          item.highlight ? 'text-[#E8B4A0] opacity-60' : 'text-gray-600 opacity-30'
        }`}
      >
        {item.char}
      </span>
    ))}
  </div>
));

export default function ScrollingBackground() {
  const [rows, setRows] = useState([]);

  // Generate rows once on mount - they persist across page navigations
  useEffect(() => {
    const newRows = Array.from({ length: 40 }).map((_, i) => {
      const duration = 35 + Math.random() * 15;
      return {
        id: i,
        data: generateRowData(60),
        duration: duration,
        delay: Math.random() * duration
      };
    });
    setRows(newRows);
  }, []);

  return (
    <>
      {/* CSS Animation */}
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: infinite-scroll linear infinite;
        }
      `}</style>

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div 
          className="absolute flex flex-col gap-4 opacity-[0.12]" 
          style={{ 
            transform: 'rotate(-45deg)',
            width: '150vmax',
            height: '150vmax'
          }}
        >
          {rows.map((row) => (
            <ScrollingRow 
              key={row.id} 
              rowData={row.data} 
              duration={row.duration} 
              delay={row.delay} 
            />
          ))}
        </div>
      </div>
    </>
  );
}


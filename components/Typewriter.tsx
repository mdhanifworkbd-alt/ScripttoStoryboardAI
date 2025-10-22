import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

const RESTART_DELAY = 2000; // Pause for 2 seconds before restarting the animation

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 100, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Function to clear any scheduled timeout.
    const clearCurrentTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    
    const type = () => {
      if (indexRef.current < text.length) {
        // Typing phase: add one character at a time.
        setDisplayedText(text.substring(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = window.setTimeout(type, speed);
      } else {
        // End of typing phase: wait for a delay, then reset and start over.
        timeoutRef.current = window.setTimeout(() => {
          indexRef.current = 0;
          setDisplayedText('');
          type();
        }, RESTART_DELAY);
      }
    };
    
    // When text or speed props change, reset everything and start the animation.
    clearCurrentTimeout();
    indexRef.current = 0;
    setDisplayedText('');
    type();

    // Cleanup function to run when the component unmounts or props change.
    return () => {
      clearCurrentTimeout();
    };
  }, [text, speed]);

  const hasGradient = className?.includes('text-transparent');

  return (
    <span className={className}>
      {displayedText}
      <span className={`typewriter-cursor ${hasGradient ? 'bg-cyan-400' : ''}`} />
    </span>
  );
};

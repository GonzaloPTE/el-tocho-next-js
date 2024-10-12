import React, { useEffect, useState } from 'react';

interface WaveformPreviewProps {
  isDarkMode: boolean;
}

export function WaveformPreview({ isDarkMode }: WaveformPreviewProps) {
  const [waveformData, setWaveformData] = useState<number[]>(Array(20).fill(0.5));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformData(prevData => 
        prevData.map(() => Math.random() * 0.8 + 0.2) // Random values between 0.2 and 1
      );
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-8 w-full">
      {waveformData.map((amplitude, index) => (
        <div
          key={index}
          className={`w-1 mx-px rounded-full transition-all duration-100 ease-in-out ${
            isDarkMode ? 'bg-stone-400' : 'bg-stone-600'
          }`}
          style={{
            height: `${amplitude * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

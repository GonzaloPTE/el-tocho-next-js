import React from 'react';

interface WaveformProps {
  currentTime: number;
  duration: number;
  waveformData: number[]; // Array of normalized amplitudes (0-1)
  onClick: (time: number) => void;
  isDarkMode: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ currentTime, duration, waveformData, onClick, isDarkMode }) => {
  const waveformRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedTime = (x / rect.width) * duration;
      onClick(clickedTime);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div 
        ref={waveformRef}
        className="h-16 w-full max-w-3xl cursor-pointer"
        onClick={handleClick}
      >
        <div className="h-full w-full flex items-center">
          {waveformData.map((amplitude, index) => {
            const isCurrent = (index / waveformData.length) * duration <= currentTime;
            return (
              <div
                key={index}
                className="flex-grow flex flex-col justify-center"
                style={{ padding: '0 0.5px', height: '100%' }}
              >
                <div
                  className={`rounded-full ${isCurrent ? (isDarkMode ? 'bg-stone-300' : 'bg-stone-700') : (isDarkMode ? 'bg-stone-600/50' : 'bg-stone-300/50')}`}
                  style={{
                    height: `${Math.max(4, amplitude * 100)}%`,
                    width: '2px',
                    transition: 'height 0.1s ease-in-out',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

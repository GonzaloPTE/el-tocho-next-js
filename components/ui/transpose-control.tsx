import React from 'react';
import { Plus, Minus, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TransposeControlProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  isDarkMode: boolean;
}

export const TransposeControl: React.FC<TransposeControlProps> = ({ value, onChange, min, max, isDarkMode }) => {
  const handleChange = (increment: number) => {
    const newValue = Math.max(min, Math.min(max, value + increment));
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
        Transponer semitonos
      </span>
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleChange(-1)}
          disabled={value === min}
          className={`rounded-full ${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center min-w-[80px]">
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>
            {value > 0 ? '+' : ''}{value}
          </span>
          <Music className={`h-4 w-4 mt-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleChange(1)}
          disabled={value === max}
          className={`rounded-full ${isDarkMode ? 'text-stone-300 hover:text-stone-100' : 'text-stone-600 hover:text-stone-800'}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

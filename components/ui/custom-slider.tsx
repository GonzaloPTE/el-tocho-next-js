import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ value, onChange, min, max, step }) => {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={[value]}
      onValueChange={([newValue]) => onChange(newValue)}
      max={max}
      min={min}
      step={step}
    >
      <SliderPrimitive.Track className="bg-stone-200 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-stone-600 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-white border-2 border-stone-600 rounded-full hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400"
      />
    </SliderPrimitive.Root>
  );
};

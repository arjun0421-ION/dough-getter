"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      value,
      min,
      max,
      step = 1,
      unit = "",
      showValue = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={`w-full ${className}`}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="text-sm font-medium text-text-dark">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-caramel">
                {value}
                {unit}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-border
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-caramel
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-caramel
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
          "
          style={{
            background: `linear-gradient(to right, #C8813A ${percentage}%, #E0CFC0 ${percentage}%)`,
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;

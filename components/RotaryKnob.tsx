'use client';

import { useState, useRef, useEffect } from 'react';

interface RotaryKnobProps {
  label: string;
  color: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function RotaryKnob({
  label,
  color,
  value,
  onChange,
  min = 0,
  max = 100,
}: RotaryKnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  const normalizeValue = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const denormalizeValue = (normalized: number) => {
    return min + (normalized / 100) * (max - min);
  };

  const normalizedValue = normalizeValue(value);
  const rotation = (normalizedValue / 100) * 270 - 135; // -135 to 135 degrees

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let degrees = (angle * 180) / Math.PI + 90;
      if (degrees < 0) degrees += 360;

      // Convert to -135 to 135 range
      let normalized = 0;
      if (degrees >= 0 && degrees <= 135) {
        normalized = degrees / 135;
      } else if (degrees > 135 && degrees <= 225) {
        normalized = 1;
      } else {
        normalized = (360 - degrees + 135) / 135;
        if (normalized > 1) normalized = 1;
      }

      const newValue = denormalizeValue(normalized * 100);
      onChange(Math.max(min, Math.min(max, newValue)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange, min, max]);

  return (
    <div className="bg-[#ececec] rounded-[4px] p-3 flex flex-col items-center gap-2.5">
      <div
        ref={knobRef}
        className="relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <div
          className={`border-[0.5px] border-solid rounded-full h-[140px] w-[143px] flex items-center justify-center`}
          style={{ borderColor: color }}
        >
          <div
            className="bg-white border border-white/5 rounded-[24px] w-8 h-8 relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>
      <p className="text-[12px] font-normal leading-[0.92] text-black">
        {label}
      </p>
    </div>
  );
}


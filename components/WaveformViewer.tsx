'use client';

import { useEffect, useRef } from 'react';

export default function WaveformViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw waveform
    ctx.fillStyle = '#0e0e12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw green waveform
    ctx.strokeStyle = '#00ED95';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.3;
    const frequency = 0.02;

    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + Math.sin(x * frequency) * amplitude * Math.random();
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw vertical dashed lines (markers)
    ctx.strokeStyle = '#00ED95';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;

    // Left marker
    const leftX = canvas.width * 0.15;
    ctx.beginPath();
    ctx.moveTo(leftX, 0);
    ctx.lineTo(leftX, canvas.height);
    ctx.stroke();

    // Right marker
    const rightX = canvas.width * 0.7;
    ctx.beginPath();
    ctx.moveTo(rightX, 0);
    ctx.lineTo(rightX, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw control points
    // Left blue circle
    ctx.fillStyle = '#4C9DFD';
    ctx.beginPath();
    ctx.arc(leftX, centerY - amplitude * 0.5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(leftX, centerY - amplitude * 0.5, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Right white circle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(rightX, centerY + amplitude * 0.3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00ED95';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rightX, centerY + amplitude * 0.3, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Draw red arrow at the end
    const arrowX = canvas.width - 20;
    ctx.fillStyle = '#FF395D';
    ctx.beginPath();
    ctx.moveTo(arrowX, centerY);
    ctx.lineTo(arrowX + 10, centerY - 5);
    ctx.lineTo(arrowX + 10, centerY + 5);
    ctx.closePath();
    ctx.fill();

    // Draw vertical bar
    ctx.fillRect(arrowX + 10, centerY - 8, 2, 16);
  };

  useEffect(() => {
    drawWaveform();

    const handleResize = () => {
      drawWaveform();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-[#d8d8d8] rounded-[4px] p-3">
      <div className="bg-[#0e0e12] rounded-[12px] shadow-[0px_13.071px_26.143px_0px_rgba(0,0,0,0.3)] p-8 relative">
        <div className="absolute top-2 left-4 text-white text-[13px] font-normal">
          C2 ♩ +10
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[200px]"
          style={{ width: '100%', height: '200px' }}
        />
      </div>
    </div>
  );
}


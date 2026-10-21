import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  mode: 'speaking' | 'listening' | 'idle';
  isDark: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isActive, mode, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);

    const render = () => {
      animationId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataArray);
      }

      const barCount = 32;
      const barWidth = 2.5;
      const gap = 3.5;
      const totalWidth = barCount * (barWidth + gap) - gap;
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        let value = 0;
        if (analyser && isActive) {
          const index = Math.floor((i / barCount) * (dataArray.length / 2));
          value = dataArray[index] / 255;
        } else if (isActive) {
          // Subtle synthetic acoustic wave
          const time = Date.now() * 0.005;
          value = 0.25 + 0.55 * Math.sin(time + i * 0.35) * Math.cos(time * 0.4 + i * 0.2);
        } else {
          // Minimalist breathing resting wave
          const time = Date.now() * 0.0018;
          value = 0.08 + 0.06 * Math.sin(time + i * 0.25);
        }

        const barHeight = Math.max(3, value * (height - 6));
        const x = startX + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Nordic Ice-Blue & Slate gradients
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (mode === 'speaking') {
          // Nordic Ice-Blue active
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(1, '#0284c7');
        } else if (mode === 'listening') {
          // Nordic Emerald listening
          gradient.addColorStop(0, '#34d399');
          gradient.addColorStop(1, '#059669');
        } else {
          // Resting subtle slate/platinum
          if (isDark) {
            gradient.addColorStop(0, '#334155');
            gradient.addColorStop(1, '#1e293b');
          } else {
            gradient.addColorStop(0, '#cbd5e1');
            gradient.addColorStop(1, '#94a3b8');
          }
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isActive, mode, isDark]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={46}
      className="mx-auto block"
    />
  );
};

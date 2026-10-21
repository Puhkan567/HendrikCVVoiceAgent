import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  mode: 'speaking' | 'listening' | 'idle';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isActive, mode }) => {
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

      const barCount = 28;
      const barWidth = 3;
      const gap = 4;
      const totalWidth = barCount * (barWidth + gap) - gap;
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        let value = 0;
        if (analyser && isActive) {
          const index = Math.floor((i / barCount) * (dataArray.length / 2));
          value = dataArray[index] / 255;
        } else if (isActive) {
          // Synthetic ambient wave if active but no direct node connected
          const time = Date.now() * 0.005;
          value = 0.3 + 0.5 * Math.sin(time + i * 0.4) * Math.cos(time * 0.5 + i * 0.2);
        } else {
          // Subtle resting breathing wave
          const time = Date.now() * 0.002;
          value = 0.12 + 0.08 * Math.sin(time + i * 0.3);
        }

        const barHeight = Math.max(4, value * (height - 8));
        const x = startX + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient based on state
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (mode === 'speaking') {
          gradient.addColorStop(0, '#818cf8'); // Indigo
          gradient.addColorStop(1, '#c084fc'); // Purple
        } else if (mode === 'listening') {
          gradient.addColorStop(0, '#34d399'); // Emerald
          gradient.addColorStop(1, '#06b6d4'); // Cyan
        } else {
          gradient.addColorStop(0, '#475569'); // Slate
          gradient.addColorStop(1, '#334155');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isActive, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={52}
      className="mx-auto block"
    />
  );
};

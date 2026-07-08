import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  bars?: number;
  className?: string;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  bars = 12,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-[3px] h-8 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const heights = [16, 24, 32, 20, 28, 36, 22, 30, 18, 26, 34, 24];
        const speeds = [0.4, 0.5, 0.35, 0.55, 0.45, 0.3, 0.6, 0.4, 0.5, 0.35, 0.45, 0.55];
        const height = heights[i % heights.length];
        const speed = speeds[i % speeds.length];

        return (
          <div
            key={i}
            className="waveform-bar"
            style={{
              '--wave-height': isActive ? `${height}px` : '8px',
              '--wave-speed': `${speed}s`,
              animationDelay: `${i * 0.05}s`,
              animationPlayState: isActive ? 'running' : 'paused',
              opacity: isActive ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export default VoiceWaveform;

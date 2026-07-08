import React, { useEffect, useRef, useState } from 'react';

interface LottieAnimationProps {
  src: string; // URL to the Lottie JSON file
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ src, loop = true, autoplay = true, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let anim: any = null;

    const initLottie = async () => {
      try {
        // Load the lottie-web player dynamically from CDN for runtime lazy loading
        if (!(window as any).lottie) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Lottie script'));
            document.head.appendChild(script);
          });
        }

        const lottie = (window as any).lottie;
        if (lottie && containerRef.current) {
          anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop,
            autoplay,
            path: src
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        setLoading(false);
      }
    };

    // Lazy load initiation
    const timer = setTimeout(() => {
      initLottie();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (anim) {
        anim.destroy();
      }
    };
  }, [src, loop, autoplay]);

  return (
    <div className={`relative ${className} w-full h-full min-h-[120px] flex items-center justify-center`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
          <div className="h-6 w-6 border-2 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default LottieAnimation;

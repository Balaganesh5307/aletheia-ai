import React from 'react';

interface FloatingShapesProps {
  variant?: 'full' | 'minimal';
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ variant = 'full' }) => {
  const shapes = variant === 'full' ? [
    { type: 'triangle', top: '8%', left: '5%', delay: '0s' },
    { type: 'circle', top: '15%', right: '12%', delay: '2s' },
    { type: 'square', top: '40%', left: '3%', delay: '4s' },
    { type: 'diamond', top: '60%', right: '6%', delay: '1s' },
    { type: 'ring', top: '75%', left: '8%', delay: '3s' },
    { type: 'cross', top: '25%', right: '4%', delay: '5s' },
    { type: 'circle', top: '85%', right: '15%', delay: '6s' },
    { type: 'triangle', top: '50%', right: '2%', delay: '7s' },
    { type: 'square', top: '90%', left: '15%', delay: '2s' },
    { type: 'diamond', top: '35%', left: '92%', delay: '4s' },
  ] : [
    { type: 'circle', top: '12%', right: '8%', delay: '0s' },
    { type: 'diamond', top: '55%', left: '4%', delay: '2s' },
    { type: 'triangle', top: '80%', right: '5%', delay: '4s' },
    { type: 'ring', top: '30%', left: '6%', delay: '1s' },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`geo-shape geo-shape-${shape.type}`}
          style={{
            top: shape.top,
            left: shape.left,
            right: shape.right,
            animationDelay: shape.delay,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

export default FloatingShapes;

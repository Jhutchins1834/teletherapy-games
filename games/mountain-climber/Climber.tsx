'use client';

import React from 'react';

type Props = {
  color: 'red' | 'blue';
  size?: number;
  celebrating?: boolean;
  className?: string;
};

/**
 * SVG climber with colored jacket and beanie.
 * Red = child's climber, Blue = therapist's climber.
 */
export default function Climber({ color, size = 40, celebrating = false, className = '' }: Props) {
  const jacket = color === 'red' ? '#dc2626' : '#2563eb';
  const jacketDark = color === 'red' ? '#b91c1c' : '#1d4ed8';
  const beanie = color === 'red' ? '#ef4444' : '#3b82f6';
  const beanieBand = color === 'red' ? '#fca5a5' : '#93c5fd';
  const skin = '#fcd5b4';
  const pants = '#374151';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      style={celebrating ? { animation: 'climber-celebrate 0.5s ease-in-out infinite alternate' } : undefined}
    >
      {/* Shadow */}
      <ellipse cx="20" cy="38" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />

      {/* Legs */}
      <rect x="15" y="28" width="4" height="8" rx="1.5" fill={pants} />
      <rect x="21" y="28" width="4" height="8" rx="1.5" fill={pants} />

      {/* Boots */}
      <rect x="14" y="34" width="6" height="3" rx="1.5" fill="#1f2937" />
      <rect x="20" y="34" width="6" height="3" rx="1.5" fill="#1f2937" />

      {/* Body / jacket */}
      <rect x="13" y="18" width="14" height="12" rx="3" fill={jacket} />
      {/* Jacket detail — zipper line */}
      <line x1="20" y1="19" x2="20" y2="29" stroke={jacketDark} strokeWidth="0.8" />

      {/* Arms */}
      {celebrating ? (
        <>
          {/* Arms raised in celebration */}
          <rect x="7" y="10" width="4" height="10" rx="2" fill={jacket} transform="rotate(-20 9 15)" />
          <rect x="29" y="10" width="4" height="10" rx="2" fill={jacket} transform="rotate(20 31 15)" />
          {/* Hands */}
          <circle cx="8" cy="10" r="2.5" fill={skin} />
          <circle cx="32" cy="10" r="2.5" fill={skin} />
        </>
      ) : (
        <>
          {/* Arms at sides */}
          <rect x="8" y="19" width="4" height="10" rx="2" fill={jacket} />
          <rect x="28" y="19" width="4" height="10" rx="2" fill={jacket} />
          {/* Hands */}
          <circle cx="10" cy="29" r="2.5" fill={skin} />
          <circle cx="30" cy="29" r="2.5" fill={skin} />
        </>
      )}

      {/* Head */}
      <circle cx="20" cy="13" r="6" fill={skin} />

      {/* Eyes — cheerful */}
      <circle cx="17.5" cy="12.5" r="1.2" fill="#1f2937" />
      <circle cx="22.5" cy="12.5" r="1.2" fill="#1f2937" />
      <circle cx="17.8" cy="12.2" r="0.4" fill="white" />
      <circle cx="22.8" cy="12.2" r="0.4" fill="white" />

      {/* Smile */}
      <path d="M 17.5 15 Q 20 17.5 22.5 15" stroke="#1f2937" strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Beanie */}
      <ellipse cx="20" cy="9" rx="7" ry="4" fill={beanie} />
      {/* Beanie band */}
      <rect x="13" y="9" width="14" height="2.5" rx="1" fill={beanieBand} />
      {/* Beanie pom */}
      <circle cx="20" cy="5.5" r="2" fill={beanieBand} />
    </svg>
  );
}

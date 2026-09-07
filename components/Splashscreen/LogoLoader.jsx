"use client";

import React from "react";

/**
 * LogoLoader component designed based on the Ayatrio spiral pill logo.
 * 
 * Props:
 * - size: number | string (default: 120) - size of the loader SVG in pixels
 * - text: string - optional loading text displayed below the loader
 * - speed: number (default: 3) - rotation animation duration in seconds
 * - variant: 'spin' | 'ripple' | 'pulse' | 'static' (default: 'spin') - animation style
 * - fullScreen: boolean (default: false) - display as a centered full-screen overlay
 * - className: string - additional CSS classes for container wrapper
 * - textClassName: string - additional CSS classes for loading text
 */

// Ring configuration matching the logo spiral structure
const RINGS = [
  {
    // Inner Ring - Vibrant Red-Pink
    radius: 25,
    count: 8,
    color: "#F52D56",
    width: 6,
    height: 12,
    rx: 3,
    angleOffset: 0,
    tilt: 40,
  },
  {
    // Mid-Inner Ring - Red-Orange
    radius: 43,
    count: 12,
    color: "#FF6600",
    width: 7,
    height: 14,
    rx: 3.5,
    angleOffset: 12,
    tilt: 38,
  },
  {
    // Mid-Outer Ring - Bright Orange / Amber
    radius: 63,
    count: 16,
    color: "#FFA800",
    width: 8,
    height: 16,
    rx: 4,
    angleOffset: 24,
    tilt: 36,
  },
  {
    // Outer Ring - Golden Yellow
    radius: 83,
    count: 20,
    color: "#FFC800",
    width: 9,
    height: 18,
    rx: 4.5,
    angleOffset: 36,
    tilt: 34,
  },
];

const LogoLoader = ({
  size = 120,
  text = "",
  speed = 3,
  variant = "spin",
  fullScreen = false,
  className = "",
  textClassName = "",
}) => {
  const center = 100;
  const viewBoxSize = 200;

  // Calculate dot positions dynamically
  const dots = [];
  let dotId = 0;

  RINGS.forEach((ring, ringIndex) => {
    const angleStep = 360 / ring.count;

    for (let i = 0; i < ring.count; i++) {
      const angleDeg = ring.angleOffset + i * angleStep;
      const angleRad = (angleDeg * Math.PI) / 180;

      const x = center + ring.radius * Math.cos(angleRad);
      const y = center + ring.radius * Math.sin(angleRad);
      const rotation = angleDeg + ring.tilt;

      dots.push({
        id: dotId++,
        ringIndex,
        dotIndex: i,
        totalInRing: ring.count,
        x,
        y,
        width: ring.width,
        height: ring.height,
        rx: ring.rx,
        color: ring.color,
        rotation,
      });
    }
  });

  const getContainerAnimationClass = () => {
    if (variant === "spin") return "animate-spin-custom";
    if (variant === "pulse") return "animate-pulse-custom";
    return "";
  };

  const loaderContent = (
    <div
      className={`inline-flex flex-col items-center justify-center ${className}`}
      aria-label="Loading"
      role="status"
    >
      <style>{`
        @keyframes ayatrioSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ayatrioPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.92); opacity: 0.85; }
        }
        @keyframes ayatrioDotRipple {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.65); opacity: 0.35; }
        }
        .animate-spin-custom {
          animation: ayatrioSpin ${speed}s linear infinite;
        }
        .animate-pulse-custom {
          animation: ayatrioPulse 2s ease-in-out infinite;
        }
        .ayatrio-dot-ripple {
          animation: ayatrioDotRipple 1.8s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      <div
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center ${getContainerAnimationClass()}`}
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {dots.map((dot) => {
            const isRipple = variant === "ripple";
            // Calculate ripple delay based on ring index and position
            const delay = isRipple
              ? (dot.ringIndex * 0.2 + (dot.dotIndex / dot.totalInRing) * 0.4).toFixed(2)
              : 0;

            return (
              <g
                key={dot.id}
                transform={`translate(${dot.x}, ${dot.y}) rotate(${dot.rotation})`}
                className={isRipple ? "ayatrio-dot-ripple" : ""}
                style={isRipple ? { animationDelay: `${delay}s` } : undefined}
              >
                <rect
                  x={-dot.width / 2}
                  y={-dot.height / 2}
                  width={dot.width}
                  height={dot.height}
                  rx={dot.rx}
                  ry={dot.rx}
                  fill={dot.color}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {text && (
        <p
          className={`mt-3 text-sm font-medium text-gray-600 tracking-wide animate-pulse ${textClassName}`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default LogoLoader;

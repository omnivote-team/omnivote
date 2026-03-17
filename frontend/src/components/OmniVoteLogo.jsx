import React from "react";

function OmniVoteLogo({ size = 44, showText = true }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ovGradient" x1="8" y1="8" x2="56" y2="56">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="url(#ovGradient)"
          strokeWidth="5"
          fill="rgba(255,255,255,0.02)"
        />

        <path
          d="M23 32L29 38L41 25"
          stroke="url(#ovGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: size * 0.55,
            fontWeight: 700,
            color: "#f8fbff",
            letterSpacing: "0.3px",
          }}
        >
          OmniVote
        </span>
      )}
    </div>
  );
}

export default OmniVoteLogo;
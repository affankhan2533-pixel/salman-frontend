'use client';

export default function MagneticButton({ children, className = '', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </button>
  );
}

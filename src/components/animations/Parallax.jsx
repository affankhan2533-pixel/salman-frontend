'use client';

export default function Parallax({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

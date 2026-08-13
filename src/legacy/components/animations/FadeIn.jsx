'use client';

export default function FadeIn({ children, className = '' }) {
  return (
    <div className={`transition-opacity duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

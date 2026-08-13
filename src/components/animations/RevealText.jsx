'use client';

export default function RevealText({ text, className = '' }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <span className="inline-block">{text}</span>
    </span>
  );
}

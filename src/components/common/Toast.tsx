import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000, variant = 'success' }) => {
  const [progress, setProgress] = useState(100);

  const isError = variant === 'error';
  const iconColor = isError ? '#ef4444' : '#10b981';
  const progressColor = isError ? '#ef4444' : '#10b981';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Update progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up"
      style={{
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div
        className="rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          maxWidth: '90vw'
        }}
      >
        <div className="flex items-center gap-3 px-6 py-4">
          {isError ? (
            <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
          )}
          <span className="text-sm font-medium" style={{ color: '#f9fafb' }}>
            {message}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1" style={{ backgroundColor: '#374151' }}>
          <div
            className="h-full transition-all duration-50"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

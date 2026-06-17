import React from 'react';
import { useCountdown } from '../hooks/useCountdown.js';

const ReservationTimer = ({ expiresAt, onExpire }) => {
  const { formattedTime, isExpired, minutes } = useCountdown(expiresAt);

  React.useEffect(() => {
    if (isExpired && onExpire) {
      onExpire();
    }
  }, [isExpired, onExpire]);

  const getTimerColor = () => {
    if (minutes < 1) return 'text-red-600 bg-red-50 border-red-200';
    if (minutes < 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getIcon = () => {
    if (minutes < 1) {
      return (
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  if (isExpired) {
    return (
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 border border-red-200 text-red-700">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="font-semibold">Reservation Expired</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getTimerColor()}`}>
      {getIcon()}
      <span className="font-semibold text-lg font-mono">{formattedTime}</span>
      <span className="text-sm">remaining</span>
    </div>
  );
};

export default ReservationTimer;
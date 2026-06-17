import React from 'react';
import { useCountdown } from '../hooks/useCountdown.js';

const ReservationTimer = ({ expiresAt, onExpire }) => {
  const { formattedTime, isExpired, minutes } = useCountdown(expiresAt);

  React.useEffect(() => {
    if (isExpired && onExpire) {
      onExpire();
    }
  }, [isExpired, onExpire]);

  const getTimerStyles = () => {
    if (minutes < 1) return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400';
    if (minutes < 3) return 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400';
    return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400';
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
      <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="font-semibold">Reservation Expired</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-gradient-to-r border ${getTimerStyles()}`}>
      {getIcon()}
      <span className="font-bold text-xl font-mono tracking-wider">{formattedTime}</span>
      <span className="text-sm opacity-70">remaining</span>
    </div>
  );
};

export default ReservationTimer;
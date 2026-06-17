import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      setTimeLeft(0);
      setIsExpired(true);
      return 0;
    }

    setTimeLeft(difference);
    setIsExpired(false);
    return difference;
  }, [targetDate]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    timeLeft,
    formattedTime,
    isExpired,
    minutes,
    seconds,
  };
};
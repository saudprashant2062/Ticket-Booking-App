import React from 'react';

const Seat = ({ seatNumber, status, isSelected, onClick, disabled }) => {
  const getStatusStyles = () => {
    if (isSelected) {
      return 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-110 border-0';
    }

    switch (status) {
      case 'available':
        return 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:scale-105 hover:border-white/40';
      case 'reserved':
        return 'bg-yellow-500/20 text-yellow-500/70 border border-yellow-500/30 cursor-not-allowed';
      case 'booked':
        return 'bg-red-500/10 text-red-500/50 border border-red-500/20 cursor-not-allowed opacity-50';
      default:
        return 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed';
    }
  };

  const isClickable = status === 'available' && !disabled;

  return (
    <button
      onClick={() => isClickable && onClick(seatNumber)}
      disabled={!isClickable}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs
        transition-all duration-200 flex items-center justify-center
        ${getStatusStyles()}
        ${isClickable ? 'cursor-pointer active:scale-95' : ''}
      `}
      title={`${seatNumber} - ${status}${isSelected ? ' (selected)' : ''}`}
    >
      {seatNumber}
    </button>
  );
};

export default Seat;
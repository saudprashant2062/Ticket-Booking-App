import React from 'react';

const Seat = ({ seatNumber, status, isSelected, onClick, disabled }) => {
  const getStatusStyles = () => {
    if (isSelected) {
      return 'bg-blue-600 text-white border-blue-600 shadow-lg scale-110';
    }

    switch (status) {
      case 'available':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:scale-105';
      case 'reserved':
        return 'bg-yellow-500 text-white border-yellow-500 cursor-not-allowed opacity-80';
      case 'booked':
        return 'bg-red-500 text-white border-red-500 cursor-not-allowed opacity-60';
      default:
        return 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed';
    }
  };

  const isClickable = status === 'available' && !disabled;

  return (
    <button
      onClick={() => isClickable && onClick(seatNumber)}
      disabled={!isClickable}
      className={`
        w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-semibold text-xs sm:text-sm
        border-2 transition-all duration-200 flex items-center justify-center
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
import React from 'react';
import Seat from './Seat.jsx';

const SeatGrid = ({ seats, selectedSeats, onSeatClick, disabled }) => {
  const rows = Object.keys(seats).sort();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-full max-w-2xl mx-auto h-2 bg-gray-300 rounded-full mb-2 shadow-inner"></div>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Screen</span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center space-x-2">
            <span className="w-8 text-center font-bold text-gray-500 text-sm">
              {row}
            </span>
            <div className="flex space-x-2">
              {seats[row].map((seat) => (
                <Seat
                  key={seat.seatNumber}
                  seatNumber={seat.seatNumber}
                  status={seat.status}
                  isSelected={selectedSeats.includes(seat.seatNumber)}
                  onClick={onSeatClick}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-green-500 border-2 border-green-500"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-yellow-500 border-2 border-yellow-500 opacity-80"></div>
          <span className="text-sm text-gray-600">Reserved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-red-500 border-2 border-red-500 opacity-60"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-blue-600 border-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
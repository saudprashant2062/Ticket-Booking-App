import React from 'react';
import Seat from './Seat.jsx';

const SeatGrid = ({ seats, selectedSeats, onSeatClick, disabled }) => {
  const rows = Object.keys(seats).sort();

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="text-center mb-8">
        <div className="w-full max-w-2xl mx-auto h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 rounded-full mb-3"></div>
        <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Screen</span>
      </div>

      {/* Seats */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center space-x-1 sm:space-x-2">
            <span className="w-6 sm:w-8 text-center font-bold text-white/30 text-xs sm:text-sm">
              {row}
            </span>
            <div className="flex space-x-1 sm:space-x-2">
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

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-xs text-white/50">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-yellow-500 opacity-80"></div>
          <span className="text-xs text-white/50">Reserved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-500 opacity-60"></div>
          <span className="text-xs text-white/50">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <span className="text-xs text-white/50">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
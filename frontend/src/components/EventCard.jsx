import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradient = (name) => {
    const gradients = [
      'from-purple-600 to-pink-600',
      'from-blue-600 to-purple-600',
      'from-pink-600 to-red-600',
      'from-indigo-600 to-blue-600',
      'from-emerald-600 to-teal-600',
      'from-orange-600 to-red-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="card group">
      <div className={`h-48 bg-gradient-to-br ${getGradient(event.name)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {event.totalSeats} seats
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center text-white/50 mb-3 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(event.dateTime)}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {event.name}
        </h3>

        <div className="flex items-center text-white/40 mb-4 text-sm">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center py-2.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm font-medium"
        >
          View Seats
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
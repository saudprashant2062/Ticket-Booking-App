import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';
import { eventService } from '../services/eventService.js';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventService.getAllEvents();
        setEvents(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Failed to load events</h2>
          <p className="text-white/50">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            Discover <span className="gradient-text">Premium</span> Events
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Find the hottest events and venues in your town! Right here
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="btn-primary px-8 py-3 text-base">
              Explore All Events
            </button>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Experience <span className="gradient-text">Exclusivity!</span>
          </h2>
          <p className="text-white/50">Find the hottest events and venues in the town! Right here</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No events available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid.jsx';
import ReservationTimer from '../components/ReservationTimer.jsx';
import { eventService } from '../services/eventService.js';
import { useReservation } from '../hooks/useReservation.js';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reserve, confirm, getActive, isLoading, error, setError } = useReservation();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        const [eventResponse, activeRes] = await Promise.all([
          eventService.getEventById(id),
          getActive(id),
        ]);

        setEvent(eventResponse.data.event);
        setSeats(eventResponse.data.seats);

        if (activeRes) {
          setReservation(activeRes);
          setSelectedSeats(activeRes.seatNumbers);
        }
      } catch (err) {
        setPageError(err.message);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [id, getActive]);

  const handleSeatClick = useCallback((seatNumber) => {
    if (reservation) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      return [...prev, seatNumber];
    });
    setError(null);
  }, [reservation, setError]);

  const handleReserve = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    try {
      const data = await reserve(id, selectedSeats);
      setReservation(data);
      setError(null);
    } catch (err) {
      const response = await eventService.getEventById(id);
      setSeats(response.data.seats);
    }
  };

  const handleConfirmBooking = async () => {
    if (!reservation) return;
    try {
      await confirm(reservation.reservationId);
      setBookingSuccess(true);
    } catch (err) {
      setReservation(null);
      setSelectedSeats([]);
      const response = await eventService.getEventById(id);
      setSeats(response.data.seats);
    }
  };

  const handleTimerExpire = useCallback(() => {
    setReservation(null);
    setSelectedSeats([]);
    setError('Your reservation has expired. Please select seats again.');
    eventService.getEventById(id).then((res) => setSeats(res.data.seats));
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-white/50">{pageError}</p>
          <button onClick={() => navigate('/events')} className="mt-4 btn-primary">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/50 mb-2">Your seats have been successfully booked.</p>
          <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
            <p className="font-semibold text-white">{event?.name}</p>
            <p className="text-sm text-white/50 mt-1">{reservation?.seatNumbers.join(', ')}</p>
          </div>
          <button onClick={() => navigate('/events')} className="btn-primary">
            Book More Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/events')} className="text-white/50 hover:text-white mb-6 flex items-center transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{event?.name}</h1>
          <div className="flex flex-wrap gap-4 text-white/50">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event?.dateTime)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {event?.venue}
            </span>
          </div>
        </div>

        {reservation && (
          <div className="mb-6 flex justify-center">
            <ReservationTimer expiresAt={reservation.expiresAt} onExpire={handleTimerExpire} />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="card p-6 mb-6 bg-white/5 border-white/10">
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            disabled={!!reservation}
          />
        </div>

        <div className="card p-6 bg-white/5 border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">Selected Seats</h3>
              {selectedSeats.length > 0 ? (
                <p className="text-white/50">{selectedSeats.join(', ')}</p>
              ) : (
                <p className="text-white/30">No seats selected</p>
              )}
            </div>

            <div className="flex gap-3">
              {reservation ? (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  className="btn-primary px-8 py-3"
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={isLoading || selectedSeats.length === 0}
                  className="btn-primary px-8 py-3"
                >
                  {isLoading ? 'Reserving...' : `Reserve (${selectedSeats.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
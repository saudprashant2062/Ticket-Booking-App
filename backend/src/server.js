import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import Event from './models/Event.js';
import Seat from './models/Seat.js';
import User from './models/User.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();

// CORS FIX
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://ticket-booking-app-orpin.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ success: true, message: 'BookMyTicket API is running' });
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', reservationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server and seed if empty
const startServer = async () => {
  try {
    await connectDB();
    
    // AUTO-SEED IF DATABASE IS EMPTY
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('Database empty, seeding...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
      });

      const events = [
        {
          name: 'Avengers: Endgame - Special Screening',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          venue: 'IMAX Theater, Downtown',
          totalSeats: 100,
        },
        {
          name: 'Coldplay Music of the Spheres World Tour',
          dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          venue: 'Wembley Stadium, London',
          totalSeats: 80,
        },
        {
          name: 'Hamilton - Broadway Musical',
          dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          venue: 'Richard Rodgers Theatre, NYC',
          totalSeats: 60,
        },
        {
          name: 'NBA Finals 2026 - Game 1',
          dateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          venue: 'Madison Square Garden, NYC',
          totalSeats: 120,
        },
      ];

      const createdEvents = await Event.insertMany(events);

      const seatDocs = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

      for (const event of createdEvents) {
        const seatsPerRow = Math.floor(event.totalSeats / rows.length);
        let seatCount = 0;

        for (const row of rows) {
          for (let col = 1; col <= seatsPerRow && seatCount < event.totalSeats; col++) {
            seatDocs.push({
              eventId: event._id,
              seatNumber: `${row}${col}`,
              status: 'available',
            });
            seatCount++;
          }
        }
      }

      await Seat.insertMany(seatDocs);
      console.log('✅ Database seeded automatically!');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Server start error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
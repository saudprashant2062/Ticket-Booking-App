import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import User from '../models/User.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(process.cwd(), '.env') });

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined. Check your .env file.');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Event.deleteMany({});
    await Seat.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    });
    console.log('Created demo user:', demoUser.email);

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
    console.log(`Created ${createdEvents.length} events`);

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
    console.log(`Created ${seatDocs.length} seats`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
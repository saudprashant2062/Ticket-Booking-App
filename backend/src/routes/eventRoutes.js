import express from 'express';
import { getEvents, getEventById } from '../controllers/eventController.js';
import { eventIdValidation } from '../middleware/validators.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', eventIdValidation, getEventById);

export default router;
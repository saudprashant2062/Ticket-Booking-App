import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validate,
];

export const eventIdValidation = [
  param('id').isMongoId().withMessage('Invalid event ID format'),
  validate,
];

export const reserveValidation = [
  body('eventId')
    .trim()
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  body('seatNumbers')
    .isArray({ min: 1 })
    .withMessage('At least one seat number is required'),
  body('seatNumbers.*')
    .trim()
    .notEmpty()
    .withMessage('Seat number cannot be empty'),
  validate,
];

export const bookingValidation = [
  body('reservationId')
    .trim()
    .notEmpty()
    .withMessage('Reservation ID is required')
    .isMongoId()
    .withMessage('Invalid reservation ID format'),
  validate,
];
// // backend/src/utils/validators.js
// const { body, param, query } = require('express-validator');

// // User validators
// const userValidators = {
//   signup: [
//     body('name')
//       .trim()
//       .notEmpty().withMessage('Name is required')
//       .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
//       .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    
//     body('email')
//       .trim()
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Please provide a valid email')
//       .normalizeEmail(),
    
//     body('password')
//       .notEmpty().withMessage('Password is required')
//       .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
//       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
//   ],

//   login: [
//     body('email')
//       .trim()
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Please provide a valid email')
//       .normalizeEmail(),
    
//     body('password')
//       .notEmpty().withMessage('Password is required')
//   ]
// };

// // Event validators
// const eventValidators = {
//   create: [
//     body('title')
//       .trim()
//       .notEmpty().withMessage('Event title is required')
//       .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
//     body('description')
//       .trim()
//       .notEmpty().withMessage('Event description is required')
//       .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    
//     body('dateOptions')
//       .isArray({ min: 1 }).withMessage('At least one date option is required')
//       .custom((dateOptions) => {
//         for (const option of dateOptions) {
//           if (!option.date || !option.time) {
//             throw new Error('Each date option must have both date and time');
//           }
//           if (new Date(option.date) < new Date()) {
//             throw new Error('Date options cannot be in the past');
//           }
//         }
//         return true;
//       }),
    
//     body('pollQuestion')
//       .optional()
//       .trim()
//       .isLength({ max: 200 }).withMessage('Poll question cannot exceed 200 characters')
//   ],

//   update: [
//     body('title')
//       .optional()
//       .trim()
//       .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
//     body('description')
//       .optional()
//       .trim()
//       .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    
//     body('status')
//       .optional()
//       .isIn(['draft', 'active', 'completed', 'cancelled']).withMessage('Invalid status')
//   ],

//   invite: [
//     body('userIds')
//       .isArray({ min: 1 }).withMessage('At least one user must be invited')
//       .custom((userIds) => {
//         for (const id of userIds) {
//           if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             throw new Error('Invalid user ID format');
//           }
//         }
//         return true;
//       })
//   ],

//   respond: [
//     body('status')
//       .notEmpty().withMessage('Response status is required')
//       .isIn(['accepted', 'declined']).withMessage('Status must be either accepted or declined')
//   ],

//   validateId: [
//     param('id')
//       .notEmpty().withMessage('Event ID is required')
//       .isMongoId().withMessage('Invalid event ID format')
//   ]
// };

// // Poll validators
// const pollValidators = {
//   vote: [
//     param('pollId')
//       .notEmpty().withMessage('Poll ID is required')
//       .isMongoId().withMessage('Invalid poll ID format'),
    
//     body('optionId')
//       .notEmpty().withMessage('Option ID is required')
//       .isString().withMessage('Option ID must be a string')
//   ],

//   validatePollId: [
//     param('pollId')
//       .notEmpty().withMessage('Poll ID is required')
//       .isMongoId().withMessage('Invalid poll ID format')
//   ]
// };

// // Common validators
// const commonValidators = {
//   pagination: [
//     query('page')
//       .optional()
//       .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
//     query('limit')
//       .optional()
//       .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
//   ],

//   search: [
//     query('search')
//       .optional()
//       .trim()
//       .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters')
//       .escape()
//   ],

//   mongoId: (field) => [
//     param(field)
//       .notEmpty().withMessage(`${field} is required`)
//       .isMongoId().withMessage(`Invalid ${field} format`)
//   ]
// };

// // Sanitization helpers
// const sanitizeInput = (input) => {
//   if (typeof input !== 'string') return input;
  
//   // Remove any HTML tags
//   input = input.replace(/<[^>]*>/g, '');
  
//   // Trim whitespace
//   input = input.trim();
  
//   // Escape special characters
//   input = input
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#x27;')
//     .replace(/\//g, '&#x2F;');
  
//   return input;
// };

// // Custom validation functions
// const customValidators = {
//   isValidDate: (value) => {
//     const date = new Date(value);
//     return !isNaN(date.getTime()) && date > new Date();
//   },

//   isValidTime: (value) => {
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     return timeRegex.test(value);
//   },

//   isValidEmail: (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   },

//   isStrongPassword: (password) => {
//     // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
//   }
// };

// module.exports = {
//   userValidators,
//   eventValidators,
//   pollValidators,
//   commonValidators,
//   sanitizeInput,
//   customValidators
// };
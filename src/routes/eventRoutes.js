const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  inviteUsers,
  respondToInvite
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getEvents)
  .post([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('dateOptions').isArray({ min: 1 }).withMessage('At least one date option is required')
  ], createEvent);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

router.post('/:id/invite', inviteUsers);
router.post('/:id/respond', respondToInvite);

module.exports = router;
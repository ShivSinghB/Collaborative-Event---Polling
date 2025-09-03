const eventService = require('../services/eventService');
const { validationResult } = require('express-validator');

const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      creator: req.user.id
    };

    const event = await eventService.createEvent(eventData);
    
    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getUserEvents(req.user.id);
    
    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const inviteUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const event = await eventService.inviteUsersToEvent(
      req.params.id,
      userIds,
      req.user.id
    );
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

const respondToInvite = async (req, res, next) => {
  try {
    const { status } = req.body;
    const event = await eventService.respondToInvite(
      req.params.id,
      req.user.id,
      status
    );
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  inviteUsers,
  respondToInvite
};
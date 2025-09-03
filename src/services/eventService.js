const Event = require('../models/Event');
const User = require('../models/User');
const Poll = require('../models/Poll');

const createEvent = async (eventData) => {
  const event = await Event.create(eventData);
  
  // Create associated poll
  const pollOptions = eventData.dateOptions.map((option, index) => ({
    id: `option-${index}`,
    text: `${new Date(option.date).toLocaleDateString()} at ${option.time}`,
    dateTime: option,
    votes: []
  }));

  const poll = await Poll.create({
    event: event._id,
    question: eventData.pollQuestion || 'Choose your preferred date and time',
    options: pollOptions
  });

  event.poll = poll._id;
  await event.save();

  // Update creator's events
  await User.findByIdAndUpdate(eventData.creator, {
    $push: { createdEvents: event._id }
  });

  return event.populate(['creator', 'poll']);
};

const getUserEvents = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: 'createdEvents',
      populate: { path: 'poll participants.user' }
    })
    .populate({
      path: 'invitedEvents',
      populate: { path: 'poll participants.user creator' }
    });

  return {
    created: user.createdEvents,
    invited: user.invitedEvents
  };
};

const getEventById = async (eventId, userId) => {
  const event = await Event.findById(eventId)
    .populate('creator')
    .populate('participants.user')
    .populate('poll');

  if (!event) {
    throw new Error('Event not found');
  }

  // Check if user has access
  const isCreator = event.creator._id.toString() === userId;
  const isParticipant = event.participants.some(
    p => p.user._id.toString() === userId
  );

  if (!isCreator && !isParticipant) {
    throw new Error('Access denied');
  }

  return event;
};

const updateEvent = async (eventId, updateData, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.creator.toString() !== userId) {
    throw new Error('Only event creator can update');
  }

  Object.assign(event, updateData);
  await event.save();

  return event.populate(['creator', 'participants.user', 'poll']);
};

const deleteEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.creator.toString() !== userId) {
    throw new Error('Only event creator can delete');
  }

  // Delete associated poll
  await Poll.findByIdAndDelete(event.poll);

  // Remove from users' lists
  await User.updateMany(
    { $or: [{ createdEvents: eventId }, { invitedEvents: eventId }] },
    { $pull: { createdEvents: eventId, invitedEvents: eventId } }
  );

  await event.deleteOne();
};

const inviteUsersToEvent = async (eventId, userIds, inviterId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.creator.toString() !== inviterId) {
    throw new Error('Only event creator can invite users');
  }

  // Add participants
  const newParticipants = userIds.map(userId => ({
    user: userId,
    status: 'pending'
  }));

  event.participants.push(...newParticipants);
  await event.save();

  // Update invited users and send notifications
  for (const userId of userIds) {
    await User.findByIdAndUpdate(userId, {
      $push: {
        invitedEvents: eventId,
        notifications: {
          type: 'event_invite',
          message: `You've been invited to "${event.title}"`,
          eventId: eventId
        }
      }
    });
  }

  return event.populate(['creator', 'participants.user', 'poll']);
};

const respondToInvite = async (eventId, userId, status) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  const participantIndex = event.participants.findIndex(
    p => p.user.toString() === userId
  );

  if (participantIndex === -1) {
    throw new Error('User not invited to this event');
  }

  event.participants[participantIndex].status = status;
  await event.save();

  return event.populate(['creator', 'participants.user', 'poll']);
};

module.exports = {
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  inviteUsersToEvent,
  respondToInvite
};
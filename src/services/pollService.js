const Poll = require('../models/Poll');
const Event = require('../models/Event');

const voteOnPoll = async (pollId, optionId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (poll.status === 'closed') {
    throw new Error('Poll is closed');
  }

  // Check if user is participant
  const event = await Event.findById(poll.event);
  const isParticipant = event.participants.some(
    p => p.user.toString() === userId && p.status === 'accepted'
  ) || event.creator.toString() === userId;

  if (!isParticipant) {
    throw new Error('Only event participants can vote');
  }

  // Remove previous votes if not allowing multiple
  if (!poll.allowMultipleVotes) {
    poll.options.forEach(option => {
      option.votes = option.votes.filter(
        vote => vote.user.toString() !== userId
      );
    });
  }

  // Add new vote
  const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
  if (optionIndex === -1) {
    throw new Error('Invalid option');
  }

  poll.options[optionIndex].votes.push({ user: userId });
  await poll.save();

  return poll.populate('event');
};

const getPollResults = async (pollId) => {
  const poll = await Poll.findById(pollId)
    .populate('event')
    .populate('options.votes.user', 'name avatar');

  if (!poll) {
    throw new Error('Poll not found');
  }

  const results = poll.options.map(option => ({
    id: option.id,
    text: option.text,
    dateTime: option.dateTime,
    voteCount: option.votes.length,
    voters: poll.isAnonymous ? [] : option.votes.map(vote => ({
      name: vote.user.name,
      avatar: vote.user.avatar,
      votedAt: vote.votedAt
    }))
  }));

  return {
    question: poll.question,
    totalVotes: results.reduce((sum, opt) => sum + opt.voteCount, 0),
    options: results,
    status: poll.status
  };
};

module.exports = {
  voteOnPoll,
  getPollResults
};
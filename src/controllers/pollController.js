const pollService = require('../services/pollService');

const vote = async (req, res, next) => {
  try {
    const { optionId } = req.body;
    const poll = await pollService.voteOnPoll(
      req.params.pollId,
      optionId,
      req.user.id
    );
    
    res.status(200).json({
      success: true,
      poll
    });
  } catch (error) {
    next(error);
  }
};

const getPollResults = async (req, res, next) => {
  try {
    const results = await pollService.getPollResults(req.params.pollId);
    
    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  vote,
  getPollResults
};
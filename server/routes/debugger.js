const express = require('express');
const router = express.Router();
const debuggerController = require('../controllers/debuggerController');

/**
 * @route POST /api/debugger/start
 * @desc Start a debugging session
 * @access Public
 */
router.post('/start', debuggerController.startSession);

/**
 * @route POST /api/debugger/command
 * @desc Send a command to a debugging session
 * @access Public
 */
router.post('/command', debuggerController.sendCommand);

/**
 * @route GET /api/debugger/state/:sessionId
 * @desc Get the state of a debugging session
 * @access Public
 */
router.get('/state/:sessionId', debuggerController.getSessionState);

/**
 * @route DELETE /api/debugger/end/:sessionId
 * @desc End a debugging session
 * @access Public
 */
router.delete('/end/:sessionId', debuggerController.endSession);

module.exports = router;

const debuggerService = require('../services/debuggerService');

/**
 * Controller for handling C++ debugging requests
 */
class DebuggerController {
  /**
   * Start a debugging session
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async startSession(req, res) {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Compilation ID is required'
        });
      }
      
      const result = await debuggerService.startDebugSession(id);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in startSession controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * Send a command to a debugging session
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async sendCommand(req, res) {
    try {
      const { sessionId, command } = req.body;
      
      if (!sessionId || !command) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and command are required'
        });
      }
      
      const result = await debuggerService.sendCommand(sessionId, command);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in sendCommand controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * Get the state of a debugging session
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  getSessionState(req, res) {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }
      
      const result = debuggerService.getSessionState(sessionId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in getSessionState controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * End a debugging session
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }
      
      const result = await debuggerService.endDebugSession(sessionId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in endSession controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new DebuggerController();

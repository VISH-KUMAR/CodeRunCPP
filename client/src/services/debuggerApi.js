import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Service for interacting with the debugger API
 */
class DebuggerApi {
  /**
   * Start a debugging session
   * @param {string} id - Compilation ID
   * @returns {Promise<object>} - Debug session result
   */
  async startSession(id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/debugger/start`, { id });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error',
        error: error.message
      };
    }
  }

  /**
   * Send a command to a debugging session
   * @param {string} sessionId - Debug session ID
   * @param {string} command - GDB command to send
   * @returns {Promise<object>} - Command result
   */
  async sendCommand(sessionId, command) {
    try {
      const response = await axios.post(`${API_BASE_URL}/debugger/command`, { sessionId, command });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error',
        error: error.message
      };
    }
  }

  /**
   * Get the state of a debugging session
   * @param {string} sessionId - Debug session ID
   * @returns {Promise<object>} - Session state
   */
  async getSessionState(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/debugger/state/${sessionId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error',
        error: error.message
      };
    }
  }

  /**
   * End a debugging session
   * @param {string} sessionId - Debug session ID
   * @returns {Promise<object>} - End result
   */
  async endSession(sessionId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/debugger/end/${sessionId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error',
        error: error.message
      };
    }
  }
}

// Create instance before exporting
const debuggerApiInstance = new DebuggerApi();
export default debuggerApiInstance;

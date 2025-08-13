import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Service for interacting with the compiler API
 */
class CompilerApi {
  /**
   * Compile C++ code
   * @param {string} code - C++ code to compile
   * @returns {Promise<object>} - Compilation result
   */
  async compileCode(code) {
    try {
      const response = await axios.post(`${API_BASE_URL}/compiler/compile`, { code });
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
   * Execute compiled C++ code
   * @param {string} id - ID of the compiled program
   * @param {string} input - Standard input for the program
   * @returns {Promise<object>} - Execution result
   */
  async executeCode(id, input = '') {
    try {
      const response = await axios.post(`${API_BASE_URL}/compiler/execute`, { id, input });
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
   * Clean up temporary files
   * @param {string} id - ID of the temporary files to clean
   * @returns {Promise<object>} - Cleanup result
   */
  async cleanup(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/compiler/cleanup/${id}`);
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
const compilerApiInstance = new CompilerApi();
export default compilerApiInstance;

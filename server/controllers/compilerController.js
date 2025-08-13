const compilerService = require('../services/compilerService');

/**
 * Controller for handling C++ compilation and execution requests
 */
class CompilerController {
  /**
   * Compile C++ code
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async compile(req, res) {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Code is required'
        });
      }
      
      const result = await compilerService.compileCode(code);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in compile controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * Execute compiled C++ code
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async execute(req, res) {
    try {
      const { id, input } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Compilation ID is required'
        });
      }
      
      const result = await compilerService.executeCode(id, input);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error in execute controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  /**
   * Clean up temporary files
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async cleanup(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Compilation ID is required'
        });
      }
      
      await compilerService.cleanup(id);
      return res.status(200).json({
        success: true,
        message: 'Cleanup successful'
      });
    } catch (error) {
      console.error('Error in cleanup controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new CompilerController();

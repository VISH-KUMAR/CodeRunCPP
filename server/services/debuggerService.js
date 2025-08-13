const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

/**
 * Service for debugging C++ code using GDB
 */
class DebuggerService {
  constructor() {
    this.debugSessions = {};
  }

  /**
   * Start a debugging session
   * @param {string} id - Compilation ID
   * @returns {Promise<object>} - Debug session result
   */
  async startDebugSession(id) {
    const tempDir = path.join(__dirname, '../../temp');
    const outputFile = path.join(tempDir, `${id}.out`);
    
    try {
      // Check if GDB is installed
      try {
        await execPromise('which gdb || gdb --version');
      } catch (error) {
        return {
          success: false,
          message: 'GDB debugger is not installed. Please install GDB to use debugging features.'
        };
      }
      
      // Check if the compiled output exists
      if (!fs.existsSync(outputFile)) {
        return {
          success: false,
          message: 'No compiled output found. Please compile the code first.'
        };
      }
      
      const sessionId = uuidv4();
      let gdbProcess;
      
      // Check if Docker is available (same check as in compilerService)
      let dockerAvailable = false;
      try {
        await execPromise('docker --version', { stdio: 'ignore' });
        dockerAvailable = true;
      } catch (error) {
        console.warn('Docker not available for debugging. Using local GDB.');
      }

      if (dockerAvailable) {
        // Use GDB in Docker container
        const dockerArgs = [
          'run', '--rm', '-i',
          '-v', `${tempDir}:/code`,
          '--name', `cpp-debug-${sessionId}`,
          '--security-opt=seccomp=unconfined', // Needed for debugging
          'cpp-runner',
          'gdb', '-q', `/code/${id}.out`
        ];
        
        gdbProcess = spawn('docker', dockerArgs);
      } else {
        // Use local GDB
        gdbProcess = spawn('gdb', ['-q', outputFile]);
      }

      // Store the session
      this.debugSessions[sessionId] = {
        process: gdbProcess,
        id: id,
        output: [],
        isActive: true,
        lastCommand: null
      };

      // Set up event listeners
      gdbProcess.stdout.on('data', (data) => {
        const output = data.toString();
        this.debugSessions[sessionId].output.push({
          type: 'stdout',
          content: output
        });
      });

      gdbProcess.stderr.on('data', (data) => {
        const output = data.toString();
        this.debugSessions[sessionId].output.push({
          type: 'stderr',
          content: output
        });
      });

      gdbProcess.on('error', (error) => {
        console.error(`Error in debug session ${sessionId}:`, error);
        this.debugSessions[sessionId].isActive = false;
        this.debugSessions[sessionId].error = error.message;
      });

      gdbProcess.on('close', (code) => {
        console.log(`Debug session ${sessionId} closed with code ${code}`);
        this.debugSessions[sessionId].isActive = false;
        this.debugSessions[sessionId].exitCode = code;
      });

      // Send initial setup commands to GDB
      await this.sendCommand(sessionId, 'set pagination off');
      await this.sendCommand(sessionId, 'set print pretty on');
      
      return {
        success: true,
        sessionId,
        message: 'Debug session started'
      };
    } catch (error) {
      console.error('Error starting debug session:', error);
      return {
        success: false,
        message: 'Server error during debug session initialization',
        error: error.message
      };
    }
  }

  /**
   * Send a command to a debug session
   * @param {string} sessionId - Debug session ID
   * @param {string} command - GDB command to send
   * @returns {Promise<object>} - Command result
   */
  async sendCommand(sessionId, command) {
    const session = this.debugSessions[sessionId];
    
    if (!session) {
      return {
        success: false,
        message: 'Debug session not found'
      };
    }

    if (!session.isActive) {
      return {
        success: false,
        message: 'Debug session is not active'
      };
    }

    try {
      // Clear previous output
      session.output = [];
      
      // Send the command
      session.process.stdin.write(command + '\n');
      session.lastCommand = command;
      
      // Wait for GDB to process the command (simple approach)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        output: session.output,
        command
      };
    } catch (error) {
      console.error(`Error sending command to debug session ${sessionId}:`, error);
      return {
        success: false,
        message: 'Error sending command to debugger',
        error: error.message
      };
    }
  }

  /**
   * Get the current state of a debug session
   * @param {string} sessionId - Debug session ID
   * @returns {object} - Session state
   */
  getSessionState(sessionId) {
    const session = this.debugSessions[sessionId];
    
    if (!session) {
      return {
        success: false,
        message: 'Debug session not found'
      };
    }

    return {
      success: true,
      isActive: session.isActive,
      output: session.output,
      lastCommand: session.lastCommand
    };
  }

  /**
   * End a debug session
   * @param {string} sessionId - Debug session ID
   * @returns {Promise<object>} - Result
   */
  async endDebugSession(sessionId) {
    const session = this.debugSessions[sessionId];
    
    if (!session) {
      return {
        success: false,
        message: 'Debug session not found'
      };
    }

    try {
      if (session.isActive) {
        // Try to exit GDB gracefully
        session.process.stdin.write('quit\ny\n');
        
        // Force terminate after a timeout
        setTimeout(() => {
          try {
            if (session.process && !session.process.killed) {
              session.process.kill('SIGKILL');
            }
          } catch (e) {
            console.error(`Error killing debug session ${sessionId}:`, e);
          }
        }, 1000);
      }
      
      // Remove the session
      delete this.debugSessions[sessionId];
      
      return {
        success: true,
        message: 'Debug session ended'
      };
    } catch (error) {
      console.error(`Error ending debug session ${sessionId}:`, error);
      return {
        success: false,
        message: 'Error ending debug session',
        error: error.message
      };
    }
  }
}

const debuggerService = new DebuggerService();
module.exports = debuggerService;

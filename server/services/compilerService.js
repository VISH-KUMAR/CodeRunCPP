const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Check if Docker is available
let dockerAvailable = false;
try {
  execSync('docker --version', { stdio: 'ignore' });
  dockerAvailable = true;
  console.log('Docker is available. Using Docker for code execution.');
} catch (error) {
  console.warn('Docker not available. Falling back to local execution (less secure).');
}

/**
 * Service for compiling and executing C++ code
 */
class CompilerService {
  /**
   * Compile C++ code
   * @param {string} code - C++ code to compile
   * @returns {Promise<object>} - Compilation result
   */
  async compileCode(code) {
    const id = uuidv4();
    const tempDir = path.join(__dirname, '../../temp');
    const sourceFile = path.join(tempDir, `${id}.cpp`);
    const outputFile = path.join(tempDir, `${id}.out`);
    
    try {
      // Write code to file
      await fs.promises.writeFile(sourceFile, code);
      
      let compileCommand;
      
      if (dockerAvailable) {
        // Compile code with g++ in Docker container
        compileCommand = `docker run --rm -v "${tempDir}:/code" --name cpp-compile-${id} cpp-runner g++ -std=c++17 -Wall -O2 -g "/code/${id}.cpp" -o "/code/${id}.out"`;
      } else {
        // Fallback to local compilation
        compileCommand = `g++ -std=c++17 -Wall -O2 -g "${sourceFile}" -o "${outputFile}"`;
      }
      
      try {
        await execPromise(compileCommand);
        return {
          success: true,
          id,
          message: 'Compilation successful'
        };
      } catch (error) {
        return {
          success: false,
          message: 'Compilation error',
          error: error.stderr
        };
      }
    } catch (error) {
      console.error('Error in compilation process:', error);
      return {
        success: false,
        message: 'Server error during compilation',
        error: error.message
      };
    }
  }

  /**
   * Execute compiled C++ program
   * @param {string} id - ID of the compiled program
   * @param {string} input - Standard input for the program
   * @returns {Promise<object>} - Execution result
   */
  async executeCode(id, input = '') {
    const tempDir = path.join(__dirname, '../../temp');
    const outputFile = path.join(tempDir, `${id}.out`);
    const inputFile = path.join(tempDir, `${id}.in`);
    
    try {
      // Check if the compiled output exists
      if (!fs.existsSync(outputFile)) {
        return {
          success: false,
          message: 'No compiled output found. Please compile the code first.'
        };
      }
      
      // Write input to file if provided
      if (input) {
        await fs.promises.writeFile(inputFile, input);
      }
      
      let executeCommand;
      
      if (dockerAvailable) {
        // Execute in Docker container with resource limits
        executeCommand = input 
          ? `docker run --rm -v "${tempDir}:/code" --name cpp-run-${id} --memory=128m --cpus=0.5 --pids-limit=100 --network=none --ulimit nproc=32 --ulimit nofile=1024 cpp-runner timeout 10s /code/${id}.out < /code/${id}.in`
          : `docker run --rm -v "${tempDir}:/code" --name cpp-run-${id} --memory=128m --cpus=0.5 --pids-limit=100 --network=none --ulimit nproc=32 --ulimit nofile=1024 cpp-runner timeout 10s /code/${id}.out`;
      } else {
        // Check OS platform
        const isMacOS = process.platform === 'darwin';
        
        if (isMacOS) {
          // macOS doesn't have timeout command by default, use perl instead
          executeCommand = input 
            ? `perl -e "alarm(10); exec @ARGV" "${outputFile}" < "${inputFile}"`
            : `perl -e "alarm(10); exec @ARGV" "${outputFile}"`;
        } else {
          // Linux/Windows with timeout command
          executeCommand = input 
            ? `timeout 10s "${outputFile}" < "${inputFile}"`
            : `timeout 10s "${outputFile}"`;
        }
      }
      
      try {
        const { stdout, stderr } = await execPromise(executeCommand);
        return {
          success: true,
          output: stdout,
          error: stderr
        };
      } catch (error) {
        // Check if it's a timeout
        if (error.killed || error.signal === 'SIGTERM') {
          return {
            success: false,
            message: 'Execution timed out (limit: 10 seconds)'
          };
        }
        
        return {
          success: false,
          message: 'Execution error',
          error: error.stderr || error.message
        };
      }
    } catch (error) {
      console.error('Error in execution process:', error);
      return {
        success: false,
        message: 'Server error during execution',
        error: error.message
      };
    }
  }

  /**
   * Clean up temporary files
   * @param {string} id - ID of the temporary files to clean
   */
  async cleanup(id) {
    const tempDir = path.join(__dirname, '../../temp');
    const files = [
      path.join(tempDir, `${id}.cpp`),
      path.join(tempDir, `${id}.out`),
      path.join(tempDir, `${id}.in`)
    ];
    
    for (const file of files) {
      try {
        if (fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      } catch (error) {
        console.error(`Error deleting file ${file}:`, error);
      }
    }
  }
}

module.exports = new CompilerService();

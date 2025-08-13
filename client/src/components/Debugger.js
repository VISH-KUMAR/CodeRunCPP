import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import debuggerApi from '../services/debuggerApi';

/**
 * Debugger component for C++ debugging
 */
const Debugger = ({ compilationId, isDebugging, setIsDebugging }) => {
  const [sessionId, setSessionId] = useState(null);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pollInterval, setPollInterval] = useState(null);

  // Common GDB commands
  const commonCommands = [
    { label: 'List Source', command: 'list' },
    { label: 'Break main', command: 'break main' },
    { label: 'Run', command: 'run' },
    { label: 'Next', command: 'next' },
    { label: 'Step', command: 'step' },
    { label: 'Continue', command: 'continue' },
    { label: 'Print Variables', command: 'info locals' },
    { label: 'Backtrace', command: 'backtrace' }
  ];

  // Start debugging session
  const startDebugging = async () => {
    if (!compilationId) {
      setError('Please compile your code first');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await debuggerApi.startSession(compilationId);
      
      if (result.success) {
        setSessionId(result.sessionId);
        setIsDebugging(true);
        
        // Start polling for updates
        const intervalId = setInterval(() => {
          pollSessionState(result.sessionId);
        }, 1000);
        
        setPollInterval(intervalId);
      } else {
        setError(result.message || 'Failed to start debugging session');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // End debugging session
  const stopDebugging = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      await debuggerApi.endSession(sessionId);
      
      // Clear polling interval
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      
      setSessionId(null);
      setIsDebugging(false);
      setOutput([]);
    } catch (err) {
      setError('Error ending session: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll session state
  const pollSessionState = async (sid) => {
    if (!sid) return;
    
    try {
      const result = await debuggerApi.getSessionState(sid);
      
      if (result.success) {
        if (result.output && result.output.length > 0) {
          setOutput(result.output);
        }
        
        if (!result.isActive) {
          // Session ended
          stopDebugging();
        }
      }
    } catch (err) {
      console.error('Error polling session state:', err);
    }
  };

  // Send GDB command
  const sendCommand = async (cmd) => {
    if (!sessionId || !cmd) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await debuggerApi.sendCommand(sessionId, cmd);
      
      if (result.success) {
        setCommand('');
      } else {
        setError(result.message || 'Command failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendCommand(command);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      
      if (sessionId) {
        debuggerApi.endSession(sessionId).catch(console.error);
      }
    };
  }, [sessionId, pollInterval]);

  return (
    <div className="debugger-container">
      <h4>Debugger</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!isDebugging ? (
        <Button 
          variant="info" 
          onClick={startDebugging} 
          disabled={isLoading || !compilationId}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" Starting Debugger..."}
            </>
          ) : (
            "Start Debugging"
          )}
        </Button>
      ) : (
        <div>
          <div className="debug-output mb-3">
            <h5>Debug Console</h5>
            <div className="console-output debug-console">
              {output.map((item, index) => (
                <div 
                  key={index} 
                  className={item.type === 'stderr' ? 'console-error' : 'console-success'}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>
          
          <Form onSubmit={handleSubmit} className="mb-3">
            <Form.Group>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter GDB command..."
                  />
                </Col>
                <Col xs="auto">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={isLoading}
                  >
                    Send
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          
          <div className="common-commands mb-3">
            <h5>Common Commands</h5>
            <div className="d-flex flex-wrap">
              {commonCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline-secondary"
                  size="sm"
                  className="me-2 mb-2"
                  onClick={() => sendCommand(cmd.command)}
                  disabled={isLoading}
                >
                  {cmd.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            variant="danger" 
            onClick={stopDebugging}
            disabled={isLoading}
          >
            Stop Debugging
          </Button>
        </div>
      )}
    </div>
  );
};

export default Debugger;

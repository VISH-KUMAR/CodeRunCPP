import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CodeEditor from './components/CodeEditor';
import Console from './components/Console';
import Sidebar from './components/Sidebar';
import compilerApi from './services/api';
import { Button, Spinner } from 'react-bootstrap';

function App() {
  const [code, setCode] = useState('#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compilationId, setCompilationId] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false); // Control terminal visibility
  const [sidebarOpen, setSidebarOpen] = useState(true); // Control sidebar visibility
  const [currentFileName, setCurrentFileName] = useState('untitled.cpp'); // Track current file name
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (compilationId) {
        compilerApi.cleanup(compilationId);
      }
    };
  }, [compilationId]);

  const handleCompile = async () => {
    setOutput('');
    setError('');
    setIsCompiling(true);
    setShowTerminal(true); // Show terminal on compile as well
    console.log('Compiling code:', code.substring(0, 100) + '...');
    
    try {
      const result = await compilerApi.compileCode(code);
      console.log('Compile API response:', result);
      
      if (result.success) {
        setCompilationId(result.id);
        console.log('Compilation successful, ID:', result.id);
        setOutput('Compilation successful'); // Add output for compilation success
      } else {
        console.error('Compilation failed:', result.error);
        setError(result.error || 'Compilation failed');
      }
    } catch (err) {
      console.error('Compile network error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRun = async () => {
    if (!compilationId) {
      console.log('No compilation ID, compiling first...');
      await handleCompile();
    }
    
    setOutput('');
    setError('');
    setIsExecuting(true);
    setShowTerminal(true); // Show terminal on run
    console.log('Running with compilation ID:', compilationId);
    
    try {
      const result = await compilerApi.executeCode(compilationId, '');
      console.log('Execute API response:', result);
      
      if (result.success) {
        console.log('Setting output:', result.output);
        setOutput(result.output || 'Program executed with no output');
      } else {
        console.error('Execution failed:', result.error || result.message);
        setError(result.error || 'Execution failed: ' + (result.message || ''));
      }
    } catch (err) {
      console.error('Run network error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileSelect = (filename, fileContent) => {
    setCode(fileContent);
    setCurrentFileName(filename);
    // Reset execution state
    setOutput('');
    setError('');
    setCompilationId(null);
  };

  return (
    <div className="App dark-theme">
      <div className="toolbar">
        <div className="toolbar-left">
          <h4>DevArena++</h4>
          <span className="current-file">{currentFileName}</span>
        </div>
        <div className="toolbar-buttons">
          <Button 
            variant="secondary" 
            onClick={() => {}}
            disabled={isCompiling || isExecuting}
            className="debug-button"
          >
            {isCompiling ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {" DEBUG..."}
              </>
            ) : (
              "DEBUG"
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleCompile}
            disabled={isCompiling || isExecuting}
            className="compile-button"
          >
            {isCompiling ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {" COMPILE..."}
              </>
            ) : (
              "COMPILE"
            )}
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleRun}
            disabled={isCompiling || isExecuting}
            className="run-button"
          >
            {isExecuting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {" RUN..."}
              </>
            ) : (
              "RUN"
            )}
          </Button>
        </div>
        <div className="toolbar-right">
          <Button variant="secondary" className="config-button">
            <i className="fa fa-cog"></i>
          </Button>
        </div>
      </div>

      <div className="main-container">
        <div className="content-area">
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            onFileSelect={handleFileSelect} 
          />
          <div className={`editor-container ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
            <CodeEditor code={code} setCode={setCode} />
          </div>
        </div>
        
        {/* Terminal is now outside the editor flow and will be fixed at bottom */}
        {showTerminal && (
          <div className="terminal-container">
            <div className="terminal-header">
              <h5>Execution</h5>
              <Button 
                variant="link" 
                className="terminal-close" 
                onClick={() => setShowTerminal(false)}
              >
                ×
              </Button>
            </div>
            <Console output={output} error={error} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

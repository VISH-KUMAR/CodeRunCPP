import React from 'react';

/**
 * Console component for displaying output and errors
 */
const Console = ({ output, error }) => {
  return (
    <div className="console-container">
      <div className="console-header">
        <h5>Console Output</h5>
      </div>
      <div className="console-output">
        {error && (
          <div className="console-error">
            <pre>{error}</pre>
          </div>
        )}
        {output && (
          <div className="console-success">
            <pre>{output}</pre>
          </div>
        )}
        {!output && !error && (
          <div className="console-empty">No output to display</div>
        )}
      </div>
    </div>
  );
};

export default Console;

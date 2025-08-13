import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * Code editor component using Monaco Editor
 */
const CodeEditor = ({ code, setCode }) => {
  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="code-editor-container">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          theme: 'vs-dark',
          lineNumbers: 'on',
          roundedSelection: false,
          cursorStyle: 'line',
          renderLineHighlight: 'all',
          folding: true,
          renderIndentGuides: true
        }}
      />
    </div>
  );
};

export default CodeEditor;

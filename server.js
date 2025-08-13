const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const compilerRoutes = require('./server/routes/compiler');
const debuggerRoutes = require('./server/routes/debugger');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create temp directory for code files if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running properly' });
});

// Function to recursively read directories
function readDirectoryRecursive(dirPath, basePath = '') {
  const entries = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const relativePath = path.join(basePath, item.name);
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      entries.push({
        name: item.name,
        path: relativePath,
        type: 'directory',
        children: [] // Will be populated on frontend as needed
      });
    } else if (item.isFile() && (item.name.endsWith('.cpp') || item.name.endsWith('.h'))) {
      entries.push({
        name: item.name,
        path: relativePath,
        type: 'file'
      });
    }
  }
  
  return entries;
}

// File listing API endpoint
app.get('/api/files', (req, res) => {
  const cppCodeDir = path.join(__dirname, 'c++Code');
  const subDirectory = req.query.dir || ''; // Optional subdirectory parameter
  const targetDir = path.join(cppCodeDir, subDirectory);
  
  // Create base directory if it doesn't exist
  if (!fs.existsSync(cppCodeDir)) {
    fs.mkdirSync(cppCodeDir);
  }
  
  try {
    // Verify the requested directory is within the c++Code directory (security check)
    const resolvedPath = path.resolve(targetDir);
    if (!resolvedPath.startsWith(path.resolve(cppCodeDir))) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Create directory if it doesn't exist (for subdirectories)
    if (subDirectory && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const files = readDirectoryRecursive(targetDir, subDirectory);
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to read directory', error: error.message });
  }
});

// Get file content API endpoint
app.get('/api/files/:filepath(*)', (req, res) => {
  const filepath = req.params.filepath;
  const fullPath = path.join(__dirname, 'c++Code', filepath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      res.status(200).json({ success: true, content });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to read file', error: error.message });
  }
});

// API Routes
app.use('/api/compiler', compilerRoutes);
app.use('/api/debugger', debuggerRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

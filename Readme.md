# Dev Arena ++

A web application that allows users to write, run, and debug C++ code directly in the browser.

## Features

- Code editor with syntax highlighting for C++
- Compilation and execution of C++ code
- Debugging capabilities (breakpoints, step execution, variable inspection)
- Clean, intuitive user interface

## Technology Stack

- **Frontend**: React.js, Monaco Editor
- **Backend**: Node.js, Express.js
- **C++ Execution**: Docker containers, g++/clang, GDB

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- Docker
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd cppWebApp
```

2. Install server dependencies
```
npm install
```

3. Install client dependencies
```
cd client
npm install
cd ..
```

### Running the Application

#### Development mode
```
npm run dev-full
```

This will start both the backend server and frontend client in development mode.

#### Production mode
```
npm run build
npm start
```

## Usage

1. Write your C++ code in the editor
2. Click "Run" to compile and execute the code
3. For debugging, set breakpoints and use the debugging controls
4. View output and variable states in the console panel

## Project Structure

```
cppWebApp/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # UI components
│       └── services/       # API service calls
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── docker/                 # Docker configuration for C++ execution
└── REQUIREMENTS.md         # Project requirements
```

## License

MIT

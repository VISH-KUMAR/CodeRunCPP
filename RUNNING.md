# Running the C++ Web App

This guide provides instructions for running the C++ Web App and testing its functionality.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker (recommended for secure code execution)
- g++ compiler (if not using Docker)

## Setup Options

### Option 1: Using the Setup Script (Recommended)

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. This will:
   - Build the Docker image for C++ code execution
   - Install server dependencies
   - Install client dependencies

### Option 2: Manual Setup

1. Build the Docker image:
   ```bash
   docker build -t cpp-runner ./docker
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Option 1: Running with Docker Compose (Recommended for Security)

This option provides the most secure environment for code execution by isolating the C++ compiler and runner:

```bash
docker-compose up
```

This will start both the frontend (port 3000) and backend (port 5000) services in containers.

### Option 2: Running in Development Mode

Start both frontend and backend servers:

```bash
npm run dev-full
```

Or start them separately:

1. Start the backend:
   ```bash
   npm run server
   ```

2. Start the frontend in a separate terminal:
   ```bash
   cd client
   npm start
   ```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Testing the Application

1. Open the application in your web browser (http://localhost:3000)
2. You'll see a default "Hello World" C++ program in the editor
3. Try these testing scenarios:

### Basic Compilation and Execution

1. Click "Compile" to compile the code
2. Click "Run" to execute the compiled code
3. Observe the "Hello, World!" output in the console

### Using Example Code

We've included an example C++ program to test:

1. In the code editor, paste the contents from `/examples/hello.cpp`
2. Click "Compile" and then "Run"
3. When prompted for input, enter your name in the "Standard Input" box and click "Run" again

### Testing Compilation Errors

Introduce a deliberate error in your code (e.g., remove a semicolon) and observe the compiler error message in the console.

### Testing Input/Output

Try a program that reads input and processes it:

```cpp
#include <iostream>
int main() {
  std::string name;
  std::cout << "What is your name? ";
  std::getline(std::cin, name);
  std::cout << "Hello, " << name << "!" << std::endl;
  return 0;
}
```

1. Enter the above code
2. Click "Compile"
3. Type your name in the "Standard Input" box
4. Click "Run"
5. Observe the personalized greeting in the console

## Troubleshooting

### Docker Issues

If you encounter issues with Docker:
- Make sure Docker is running on your system
- The application will fall back to local compilation if Docker is not available (less secure)

### Compilation Errors

- Check for syntax errors in your C++ code
- The error message will appear in the console panel

### Connection Issues

- Make sure both frontend and backend servers are running
- Check that ports 3000 and 5000 are not being used by other applications

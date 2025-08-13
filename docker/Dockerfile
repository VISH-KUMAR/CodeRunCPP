FROM gcc:13-slim

# Install debugging tools
RUN apt-get update && apt-get install -y \
    gdb \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run code
RUN adduser --disabled-password --gecos '' cppuser
USER cppuser

# Set working directory
WORKDIR /code

# Default command
CMD ["bash"]

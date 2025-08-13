# Deployment Guide for C++ Web IDE

This guide provides instructions for deploying the C++ Web IDE application to production environments.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker and Docker Compose (recommended for secure deployment)
- A server or cloud platform for hosting

## Deployment Options

### Option 1: Docker Compose Deployment (Recommended)

This approach provides the most secure and consistent deployment, using containers for both the frontend and backend services.

1. Clone the repository to your server:
   ```bash
   git clone <your-repository-url>
   cd cppWebApp
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application:
   - Frontend: http://your-server-ip:3000
   - Backend API: http://your-server-ip:5000

### Option 2: Cloud Platform Deployment

#### Heroku Deployment

1. Create a new Heroku application:
   ```bash
   heroku create cpp-web-ide
   ```

2. Add the Heroku Git remote:
   ```bash
   heroku git:remote -a cpp-web-ide
   ```

3. Configure Heroku to use a multi-procfile buildpack:
   ```bash
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-multi-procfile
   ```

4. Create a Procfile for the backend:
   ```
   # Procfile
   web: node server.js
   ```

5. Create a Procfile for the frontend:
   ```
   # client/Procfile
   web: npm start
   ```

6. Set environment variables:
   ```bash
   heroku config:set PROCFILE=Procfile
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   ```

7. Push to Heroku:
   ```bash
   git push heroku main
   ```

#### AWS Elastic Beanstalk

1. Install the EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize your EB application:
   ```bash
   eb init
   ```

3. Create an environment:
   ```bash
   eb create cpp-web-ide-env
   ```

4. Deploy your application:
   ```bash
   eb deploy
   ```

### Option 3: Traditional VPS/Dedicated Server

1. Clone the repository to your server:
   ```bash
   git clone <your-repository-url>
   cd cppWebApp
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. Build the React frontend:
   ```bash
   cd client
   npm run build
   cd ..
   ```

4. Set up a process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "cpp-web-ide"
   pm2 save
   pm2 startup
   ```

5. Set up Nginx as a reverse proxy:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

6. Enable the Nginx configuration and restart:
   ```bash
   ln -s /etc/nginx/sites-available/cpp-web-ide /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Security Considerations

1. **Use Docker for Sandboxing**: Always use Docker in production to isolate code execution.

2. **Rate Limiting**: Implement API rate limiting to prevent abuse.

3. **Resource Limits**: Set resource limits on Docker containers to prevent DoS attacks.

4. **HTTPS**: Use SSL/TLS certificates (Let's Encrypt) to secure communications.

5. **Authentication**: Consider adding user authentication for multi-user environments.

## Scaling Considerations

1. **Load Balancing**: Use a load balancer (e.g., Nginx, HAProxy) for horizontal scaling.

2. **Database**: If you add user accounts, consider using a database with proper backups.

3. **Containerization**: Docker Swarm or Kubernetes for container orchestration at scale.

## Monitoring and Maintenance

1. **Logging**: Use Winston or similar for structured logging.

2. **Monitoring**: Set up Prometheus + Grafana or a service like New Relic.

3. **CI/CD**: Implement continuous integration and deployment pipelines.

## Troubleshooting

### Docker-related Issues

- Check container logs: `docker-compose logs`
- Verify container status: `docker-compose ps`

### Node.js Issues

- Check server logs
- Verify environment variables are set correctly
- Ensure ports are not being used by other services

### Nginx/Reverse Proxy Issues

- Check Nginx error logs: `/var/log/nginx/error.log`
- Verify Nginx configuration: `nginx -t`

module.exports = {
  apps: [
    {
      name: 'Backend API',
      script: '/dist/apps/backend/main.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        CORS_ORIGIN: 'https://localhost:4200',
        KEY_PATH: './certs/development/server.key',
        CERT_PATH: './certs/development/server.crt',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        CORS_ORIGIN: 'https://jeffreysanford.us',
        KEY_PATH: '/etc/letsencrypt/live/jeffreysanford.us/privkey.pem',
        CERT_PATH: '/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem',
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: 'jeffreysanford.us',
      ref: 'origin/master',
      repo: 'https://github.com/JeffreySanford/new-portfolio',
      path: '/var/www/jeffreysanford',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
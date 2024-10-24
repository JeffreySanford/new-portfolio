module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/apps/backend/main.js',  // Correct path to the built main.js file
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        SSL_KEY_PATH: './apps/backend/ssl/server.key', // Adjust for development
        SSL_CERT_PATH: './apps/backend/ssl/server.crt', // Adjust for development
      },
      env_production: {
        NODE_ENV: 'production',
        SSL_KEY_PATH: process.env.SSL_KEY_PATH || '/etc/letsencrypt/live/jeffreysanford.us/privkey.pem',
        SSL_CERT_PATH: process.env.SSL_CERT_PATH || '/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem',
        PORT: 3000,
      },    },
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

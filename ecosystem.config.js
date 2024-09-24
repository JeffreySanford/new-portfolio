//  This is for pm2 to run the server
module.exports = {
    apps: [
      {
        name: 'Backend API',
        script: 'dist/apps/backend/main.js',
        env: {
          NODE_ENV: 'development',
          PORT: 3000,
          CORS_ORIGIN: 'http://localhost:4200',
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 3000,
          CORS_ORIGIN: 'https://jeffreysanford.us'
        },
      },
    ],
  };
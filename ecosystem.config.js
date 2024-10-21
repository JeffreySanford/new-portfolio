// This is for pm2 to run the server
module.exports = {
  apps: [
    {
      name: 'Backend API',
      script: 'dist/apps/backend/main.js',  // Ensure this path matches the build output
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        CORS_ORIGIN: 'http://localhost:4200',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        CORS_ORIGIN: 'https://jeffreysanford.us',
      },
      node_args: '-r dotenv/config',
      args: '&& node -e "console.log(`NODE_ENV: ${process.env.NODE_ENV}`); console.log(`PORT: ${process.env.PORT}`); console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);"',
    },
  ],
};

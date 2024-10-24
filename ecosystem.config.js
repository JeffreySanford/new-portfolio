module.exports = {
  apps: [
    {
      name: 'Backend API',
      script: 'apps/backend/dist/apps/backend/main.js',  // Ensure this path matches the build output
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        CORS_ORIGIN: 'https://localhost:4200',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        CORS_ORIGIN: 'https://jeffreysanford.us',
        SSL_KEY_PATH: process.env.SSL_KEY_PATH,
        SSL_CERT_PATH: process.env.SSL_CERT_PATH
      },
      node_args: '-r dotenv/config',
      args: '&& node -e "console.log(`NODE_ENV: ${process.env.NODE_ENV}`); console.log(`PORT: ${process.env.PORT}`); console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);"',
    },
  ],
};


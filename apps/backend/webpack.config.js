const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const path = require('path');

module.exports = {
  entry: './src/main.ts',  // Entry point for the application
  output: {
    filename: 'main.js',
    path: path.resolve('dist/apps/backend')  // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js']  // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,  // Process TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',  // Entry point for NxAppWebpackPlugin
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
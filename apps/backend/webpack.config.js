const path = require('path');

module.exports = {
  // Other webpack configurations
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: './tsconfig.app.json',
      async: false,
    }),
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Adjust this path if your tsconfig file is located elsewhere
      // Add any other ts-jest specific configurations here
    }]
  },
  moduleFileExtensions: ['ts', 'js'],
  // Other Jest configurations
};
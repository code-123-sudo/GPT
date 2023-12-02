const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile JavaScript/React files
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/', // adjust the output path as needed
            },
          },
        ],
      },
    ],
  },
  devServer: {
     static: {
      directory: path.join(__dirname, 'dist'),
    },
    // static: path.resolve(__dirname, 'dist'), // Serve from the 'dist' directory
    port: 3000,
    open: true, // Open the default browser when the server starts
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
  },

};

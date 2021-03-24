const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = path.resolve(__dirname, 'FetchTreeChromeExt');
const destination = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    index: `./src/index.js`,
    background: `${src}/background.js`,
    contentScript: `${src}/contentScript.js`,
  },
  output: { path: destination },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
        },
      }
    ],
  },
  resolve: {
    // Allows importing JS / JSX files without specifying extension
    extensions: ['.js', '.jsx', '.mjs'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: `${src}/manifest.json`, to: destination },
        { from: `${src}/devtools.html`, to: destination },
        { from: `${src}/devtools.js`, to: destination },
        { from: `${src}/panel.html`, to: destination },
      ],
    }),
  ],
};

//OUR VERSION
// module.exports = {
//   mode: 'development',

//   devtool: 'cheap-source-map',

//   entry: {
//     bundle: './FetchTreeChromeExt/devtools.js',
//   },

//   output: {
//     filename: '[name].js',
//     path: `${__dirname}/build/FetchTreeChromeExt`,
//   },
//   resolve: {
//     extensions: ['.js', '.jsx', '.css']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.scss$|\.css$/,
//         loaders: ['style-loader', 'css-loader'],
//       }
//     ],
//   },

//   plugins: [
//     new CopyWebpackPlugin([
//       // {output}/to/file.txt
//       { from: 'FetchTreeChromeExt/manifest.json', to: '../FetchTreeChromeExt/manifest.json' },
//       { from: 'FetchTreeChromeExt/contentScript.js', to: '../FetchTreeChromeExt/contentScript.js' },
//       { from: 'FetchTreeChromeExt/background.js', to: '../FetchTreeChromeExt/background.js' },
//       { from: 'FetchTreeChromeExt/devtools.html', to: '../FetchTreeChromeExt/devtools.html' }
//     ]),
//   ],
// };

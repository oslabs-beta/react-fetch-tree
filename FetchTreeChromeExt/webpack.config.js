const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const destination = path.resolve(__dirname, "build");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/components/index.jsx",
    injectScript: "./injectScript.js",
    contentScript: "./contentScript.js",
  },
  output: {
    path: path.resolve("./build/"),
    filename: "[name].js",
    publicPath: ".",
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs",
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      { test: /\.(css)$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: `./manifest.json`, to: destination },
        { from: `./src/devtools/devtools.html`, to: destination },
        { from: `./src/devtools/devtools.js`, to: destination },
        { from: `./src/index.html`, to: destination },
        { from: `./background.js`, to: destination },
      ],
    }),
  ],
};

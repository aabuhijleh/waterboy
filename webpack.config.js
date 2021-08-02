const { resolve } = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

const extensionConfig = {
  entry: {},
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/manifest.json" },
        { from: "./src/_locales", to: "_locales/" },
      ],
    }),
    new ForkTsCheckerPlugin(),
  ],
};

const commonConfig = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/i,
        use: "babel-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3|wav)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ extensions: ["tsx", "ts", "js"], failOnWarning: true }),
  ],
  devtool: isDevelopment ? "inline-source-map" : false,
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};

const backgroundConfig = Object.assign({}, commonConfig, {
  entry: {
    index: "./src/background/index.ts",
  },
  output: {
    path: resolve(__dirname, "dist", "background"),
    filename: "[name].js",
  },
  plugins: [...commonConfig.plugins],
});

const popupConfig = Object.assign({}, commonConfig, {
  entry: {
    index: "./src/popup/index.tsx",
  },
  output: {
    path: resolve(__dirname, "dist", "popup"),
    filename: "[name].js",
  },
  plugins: [
    ...commonConfig.plugins,
    new HtmlPlugin({
      template: "src/popup/index.html",
    }),
  ],
});

module.exports = [extensionConfig, backgroundConfig, popupConfig];

const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  require("dotenv").config({
    path: ".env",
  });

  let config = {
    devtool: "inline-source-map",
    entry: "./src/client/index.tsx",
    mode: "development",
    module: {
      rules: [
        {
          exclude: /(node_modules|bower_components)/,
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
          },
        },
      ],
    },
    output: {
      filename: "app.js",
      path: path.join(__dirname, "public/assets/javascript"),
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.PUBLIC_URL": JSON.stringify(process.env.PUBLIC_URL),
        "process.env.TWITCH_CLIENT_ID": JSON.stringify(process.env.TWITCH_CLIENT_ID),
        "process.env.VERSION": JSON.stringify(require("./package.json").version),
      }),
    ],
    resolve: {
      alias: {
        "@client": path.resolve(__dirname, "src/client"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  };

  if (env.environment === "production") {
    config.devtool = false;
    config.mode = "production";
  }

  return config;
};

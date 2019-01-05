const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.less|css$/,
        loaders: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {url: false, sourceMap: true}
        }, {
          loader: 'less-loader',
          options: {relativeUrls: false, sourceMap: true}
        }],
        include: path.resolve(__dirname, "../")
      }
    ]
  }
};
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  publicPath: './',
  configureWebpack: {
    devtool: process.env.NODE_ENV === "development" ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(__dirname, './public/dll/pixi.manifest.json')
        }),
    ]
  }
}
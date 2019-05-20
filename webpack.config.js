const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const libraryName = 'moovee'
const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'
const buildPath = isDev && 'develop' || 'build'
const outputFile = '.min.js'
const outputNames = isDev && '[contenthash].[name]' || '[name]'
const outputPath = path.resolve(__dirname, buildPath)
const paths = [ buildPath ]


const indexPage = isDev
  ? { from: './src/example/dev_index.html', to: './index.html' } 
  : { from: './src/example/index.html' }  

module.exports = {
  mode: NODE_ENV || 'development',
  devtool: NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  entry: {
    [libraryName]: './src/scripts/index.js',
    markdown: './src/example/markdown.js'
  },
  output: {
    path: outputPath,
    filename: '[name]' + outputFile,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.md$/,
        use: {
          loader: 'raw-loader',
        }
      },
      { enforce: 'pre', test: /\.(js|css)$/, loader: 'remove-comments-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(paths, {}),
    new CopyWebpackPlugin([
      indexPage,
      { from: './src/example/index.css' },
      { from: './src/example/index.js' },
      { from: './src/example/github.css' },
      { from: './src/example/styles_reset.css' },
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ],
}

const path = require('path')
const webpack = require('webpack')
require('dotenv').config({ silent: true })

module.exports = {
  entry: ['whatwg-fetch', './app/client/js/index.js'],
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, './app/public/')
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.STRIPE_PUBLISHABLE_KEY)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'latest']
        }
      },
      {
        test: /\.less$/,
        loader: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '/fonts/[hash].[ext]',
            limit: 5000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '/fonts/[hash].[ext]'
          }
        }
      }
    ]
  }
}

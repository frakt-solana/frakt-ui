/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')
const HTMLWebpackPlugin = require('html-webpack-plugin')

require('dotenv').config({ path: './.env' })
require('dotenv').config({ path: './.env.local' })

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.tsx'
  },
  devServer: {
    static: './public',
    port: 3000,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: true
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [ReactRefreshTypeScript()].filter(Boolean)
              }),
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-modules-typescript-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|ico|env|glb|gltf|stl)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new ReactRefreshPlugin(),
    new HTMLWebpackPlugin({ 
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      manifest: './public/manifest.json',
    }),
    new Webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new Webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}

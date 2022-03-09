const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

module.exports = () => {
  const isProduction = process.env.NODE_ENV !== 'development';
  const analyzerMode = process.env.INTERACTIVE_ANALYZE ? 'server' : 'json';

  const plugins = [
    new Dotenv({
      safe: true,
      path: isProduction ? './.env.prod' : './.env.dev',
    }),
  ];

  if (isProduction) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode }));
  }

  return {
    webpack: {
      plugins,
    },
  };
};

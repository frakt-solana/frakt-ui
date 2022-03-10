const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

module.exports = ({ env }) => {
  console.log(env);

  const isMainnet = process.env.NETWORK === 'mainnet';
  const isBuild = env !== 'development';
  const analyze = process.env.ANALYZE && isBuild;

  const plugins = [
    new Dotenv({
      safe: true,
      path: isMainnet ? './.env.prod' : './.env.dev',
    }),
  ];

  if (analyze) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server' }));
  }

  return {
    webpack: {
      plugins,
    },
  };
};

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

module.exports = ({ env }) => {
  const isBuild = env !== 'development';
  const analyze = process.env.ANALYZE && isBuild;

  const plugins = [
    new Dotenv({
      systemvars: true,
      path: './.env.local',
    }),
  ];

  //? Use additional security variables for development
  if (!isBuild) {
    plugins.push(
      new Dotenv({
        path: './.env',
      }),
    );
  }

  if (analyze) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server' }));
  }

  return {
    webpack: {
      plugins,
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.module.rules.push({
          test: /.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        });

        return webpackConfig;
      },
    },
  };
};

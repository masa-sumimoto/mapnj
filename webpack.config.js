const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'MapNJ.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'MapNJ',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    umdNamedDefine: true,
  },
  optimization: {
    minimize: true,
  },
  mode: 'production',
};

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import fsCallbacks from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const fs = fsCallbacks.promises;

const cwd = dirname(fileURLToPath(import.meta.url));

const config = async (env) => {
  return {
    mode: env.production ? 'production' : 'development',
    entry: resolve(cwd, 'src/index.js'),
    output: {
      path: resolve(cwd, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve(cwd, 'src/index.html')
      })
    ],
    devServer: {
      open: 'firefox'
    },
    stats: {
      children: true
    }
  };
};

export default config;

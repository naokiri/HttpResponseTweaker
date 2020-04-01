import { ConfigurationFactory } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

function getDevToolOption (env: string): object {
  if (env !== 'production') {
    return { devtool: 'inline-source-map' }
  } else {
    return {}
  }
}

const config: ConfigurationFactory = () => {
  const devToolOption = getDevToolOption(process.env.NODE_ENV)
  return {
    ...devToolOption,
    entry: {
      background: './src/index.ts',
      devtools: './src/devtools/devtools.ts'
    },
    output: {
      filename: (chunkData) => {
        return chunkData.chunk.name === 'background' ? '[name].js' : '[name]/[name].js'
      }
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: '.' },
        { from: '**/*.html', to: '[path]/[name].[ext]', context: 'src'  },
        { from: 'src/manifest.json' }
      ])
    ],
    module: {
      rules: [{
        test: /\.ts$/,
        use: 'ts-loader'
      }]
    },
    resolve: {
      // Just in case to import js module
      extensions: ['.ts', 'js']
    }
  }
}

export default config

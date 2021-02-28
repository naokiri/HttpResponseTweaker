import * as webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import glob from 'glob'
import path from 'path'

function getDevToolOption(env?: string): object {
  if (env !== 'production') {
    return { devtool: 'inline-source-map' }
  } else {
    return {}
  }
}

function getEntryPointFile(dirname: string): string | undefined {
  const vuefile = glob.sync(`${dirname}${path.sep}*.vue`)
  if (vuefile.length > 0) {
    return vuefile[0]
  }
  const tsfile = glob.sync(`${dirname}${path.sep}*.ts`)
  if (tsfile.length > 0) {
    return tsfile[0]
  }
  return undefined
}

function getEntries(): webpack.Entry {
  const entries = {}
  glob.sync('src/**/').forEach(
    dirname => {
      console.log(dirname)
      const entryPointFile = getEntryPointFile(dirname)
      if (entryPointFile) {
        const filePath = path.parse(entryPointFile)
        const entryKey = `${filePath.dir.slice(4)}${path.sep}${filePath.name}`
        entries[entryKey] = `./${filePath.dir}${path.sep}${filePath.name}${filePath.ext}`
      }
    }
  )
  console.log(entries)
  return entries
}

const config: webpack.ConfigurationFactory = () => {
  const devToolOption = getDevToolOption(process.env.NODE_ENV)
  const entries = getEntries()
  return {
    ...devToolOption,
    context: __dirname,
    entry: entries,
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: '.' },
          { from: '**/*.html', to: '[path]/[name].[ext]', context: 'src' },
          { from: 'src/manifest.json' },
          { from: 'devtools/icons/*.svg', context: 'src' }
        ]
      }),
      new VueLoaderPlugin()
    ],
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }]
    },
    resolve: {
      extensions: ['.vue', '.ts', 'js', '*'],
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js',
        // Somehow vue-style-loader doesn't recongnize resolve.extensions
        './listToStyles': 'vue-style-loader/lib/listToStyles.js'
      }
    }
  }
}

export default config

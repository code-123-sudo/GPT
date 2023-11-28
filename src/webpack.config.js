const path = require('path');

module.exports = {
	entry : 'src/index.js',
	output : {
		path : path.resolve(__dirname, dist),
		filename : 'bundle.js'
	},
	resolve: {
      extensions: ['', '.js', '.jsx']
    },
	module : {
		rules : [
			{
				loader : 'babel-loader',
				test: /\.js$|jsx/,
				exclude: /node_modules/
			}

		]
	},
	devServer : {
		port : 3000,
		contentBase : './public',
		inline : true
	}
}

module.exports = {
  entry: './app/assets/frontend/main.jsx',
  output: {
    path: __dirname + '/app/assets/javascripts',
    filename: 'bundle.js',
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015']
          }
        }
      ]
    }
  }
}

module.exports = {
  entry: './app/assets/frontend/main.jsx',
  output: {
    path: __dirname + '/app/assets/javascripts',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
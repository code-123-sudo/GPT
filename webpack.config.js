const path = require('path');

module.exports = {
	entry : './src/index.js',
  mode: 'development',
	output : {
		path : path.resolve(__dirname, '/dist'),
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
				exclude: /node_modules/,
        		options: {
          			presets: ['@babel/preset-env', '@babel/preset-react'] // added options with presets
        		},
			},
			{
				test : /\.css$/,
				use: ['css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|ico|gif)$/,
				use: ['file-loader',
				],
			},
		],
	},
	devServer : {
		port : 3000,
		// contentBase : './public',
		// inline : true
	}
}

// module.exports = {
//   entry: './index.js',
//   output: {
//     path: './dist',
//     filename: 'bundle.js'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader'
//       }
//     ]
//   }
// };
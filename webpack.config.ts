import { resolve } from 'path'
import { Configuration, ProvidePlugin, config } from 'webpack';
import plugins from './plugins'
// import CleanWebpackPlugin from 'clean-webpack-plugin'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// import HtmlWebpackPlugin from 'html-webpack-plugin'

const webpackConfiguration: Configuration = {
	entry: {
		'pageOne': { import: './src/main.ts' },
		'pageTwo': { import: './src/main2.ts' }
	},
	mode: 'development',
	module: {
		rules: [
			// { test: /\.css$/, use: 'css-loader' },
			{ test: '/\.ts$/', use: 'ts-loader' },
		],
	},
	externals: {
		_: 'lodash'
	},
	output: {
		filename: '[name].js',
		path: resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: plugins

};
const normalizedWebpackOptions = config.getNormalizedWebpackOptions(webpackConfiguration);
normalizedWebpackOptions.devServer = {
	contentBase: 'dist',
	compress: true,
	port: 3000
};

export default normalizedWebpackOptions;

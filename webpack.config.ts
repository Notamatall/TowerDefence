import { resolve } from 'path'
import { Configuration, config } from 'webpack';
import plugins from './plugins'
import fs from 'fs'


const webpackConfiguration: Configuration = {
	entry: getEntry(),
	mode: 'development',
	module: {
		rules: [
			{ test: '/\.ts$/', use: 'ts-loader' }
		],
	},
	output: {
		clean: true,
		filename: '[name].js',
		path: resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: plugins,
};
const normalizedWebpackOptions = config.getNormalizedWebpackOptions(webpackConfiguration);
normalizedWebpackOptions.devServer = {
	compress: true,
	static: './dist',
	hot: true
};


function getEntry() {
	const entryFilenames = fs.readdirSync('./src/html').map(filename => filename.replace(/\.[^/.]+$/, ""));
	const webpackEntry = {};


	entryFilenames.forEach(filename => webpackEntry[filename] = `./src/scripts/${filename}.ts`);

	return webpackEntry;
}

export default normalizedWebpackOptions;

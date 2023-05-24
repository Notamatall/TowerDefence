import { resolve } from 'path'
import { Configuration, EntryObject, config } from 'webpack';
import plugins from './plugins'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs'


const webpackConfiguration: Configuration = {
	entry: getEntry(),
	mode: 'development',
	devtool: 'source-map',
	experiments: { layers: true },
	module: {
		rules: [
			{
				test: [/\.s[ac]ss$/i, /\.css$/i],
				use: [MiniCssExtractPlugin.loader, "css-loader", {
					loader: "sass-loader",
					options: {
						sourceMap: true,
						sassOptions: {
							outputStyle: "compressed",
						},
					}
				},],
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/preset-typescript', { targets: "defaults" }]
					],
					plugins: ['@babel/plugin-transform-typescript']
				}
			},
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
	hot: true,
	open: ['/menu.html'],
};


function getEntry(): EntryObject {
	const entryFilenames = fs.readdirSync('./src/html').map(filename => filename.replace(/\.[^/.]+$/, ""));
	const webpackEntry: EntryObject = {};
	entryFilenames.forEach(filename => {
		webpackEntry[filename] = { import: `./src/scripts/${filename}.ts`, layer: 'js' };
	});
	return webpackEntry;
}

export default normalizedWebpackOptions;

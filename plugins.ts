import { ProvidePlugin } from "webpack";
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';

const providePlugin = new ProvidePlugin({
	_: 'lodash',
});
const miniCssExtractPlugin = new MiniCssExtractPlugin();
const copyWebpackPlugin = new CopyWebpackPlugin({
	patterns: [{
		from: './src/sprites',
		to: './sprites'
	},]
});

const htmlFilesNames = getHtmlFilesNames();
const htmlPlugins = getHtmlPlugins(htmlFilesNames);

const webpackPlugins = [
	miniCssExtractPlugin,
	providePlugin,
	copyWebpackPlugin,
	...htmlPlugins];


function getHtmlPlugins(filesName: string[]) {
	return filesName.map(filename => {
		return new HtmlWebpackPlugin({
			template: `./src/html/${filename}`,
			inject: true,
			chunks: [filename.replace(/\.[^/.]+$/, "")],
			filename: filename,
		});
	});
}

function getHtmlFilesNames(): string[] {
	return fs.readdirSync('./src/html');
}
export default webpackPlugins;

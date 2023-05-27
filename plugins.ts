import { ProvidePlugin } from "webpack";
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import fs from 'fs';

/**
 * Plugin allows to specify aliases for paths only in webpack 
 * and then will insert it in webpack
 */
// const tsconfigPathsPlugin = new TsconfigPathsPlugin();
/**
 * make content of lib accessible from any module
 */
const providePlugin = new ProvidePlugin({ _: 'lodash' });
/**
 * Plugin inserts css into html files
 */
const miniCssExtractPlugin = new MiniCssExtractPlugin();
/**
 * Plugin copies files from folder 
 * to dist/[folderName] on webpack build
 */
const copyWebpackPlugin = new CopyWebpackPlugin({
	patterns: [{
		from: './src/assets',
		to: './assets'
	},]
});

const htmlFilesNames = getHtmlFilesNames();
const htmlPlugins = getHtmlPlugins(htmlFilesNames);

const webpackPlugins = [
	miniCssExtractPlugin,
	copyWebpackPlugin,
	providePlugin,
	...htmlPlugins];

/**
 * Plugin allows to create object of html 
 * files which will be populated with corresponding js files 
 * @property {inject} - defines where and if javascript files should be injected in html
 */
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

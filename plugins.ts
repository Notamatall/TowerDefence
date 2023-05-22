import { ProvidePlugin } from "webpack";
import CopyWebpackPlugin from 'copy-webpack-plugin'

const providePlugin = new ProvidePlugin({
	_: 'lodash',
});
const copyWebpackPlugin = new CopyWebpackPlugin({
	patterns: [{
		from: './src/sprites',
		to: './sprites'
	}]
});
const webpackPlugins = [providePlugin, copyWebpackPlugin];

export default webpackPlugins;
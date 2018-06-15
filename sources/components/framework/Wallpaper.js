import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Image,
} from 'react-native';
import Styles                         from 'components/styles.json';
import WallpSrc                       from 'images/wallpaperlogin.png';

const styles = StyleSheet.create(Styles);

export default class Wallpaper extends Component {
	render() {
		return (
			<Image style={styles.wallp} source={this.props.source}>
				{this.props.children}
			</Image>
		);
	}
}

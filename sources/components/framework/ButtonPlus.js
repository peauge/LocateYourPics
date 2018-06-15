import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
	StyleSheet,
	View,
	Image,
	TouchableHighlight,
  Button,
	Animated,
	Easing
} from 'react-native';
import arrowImg                 from 'images/buttonPlus.png';
import Icon 		                from "react-native-vector-icons/FontAwesome";


const SIZE = 50;

export default class ButtonPlus extends Component {

	render() {

		return (
			<View style={styles.container}>
				<TouchableHighlight
          onPress={this.props.onPress}
					style={styles.button}>
          <Icon name="plus" color="white" size={30}/>
				</TouchableHighlight>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	button: {
    position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		width: SIZE,
		height: SIZE,
		borderRadius: 100,
		backgroundColor: 'green',
	},
});

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	Animated,
	Easing
} from 'react-native';
import Icon 			                      from "react-native-vector-icons/FontAwesome";


const SIZE = 55;

export default class BlankPageBack extends Component {
	constructor(props) {
		super();

		this.store = props.store;
		this.state = {
			isLoading: false,
		};

		this._onPress = this._onPress.bind(this);
		this.startAnimation = this.startAnimation.bind(this);
		this.growAnimated = new Animated.Value(0);
	}

	componentDidMount() {
		this.store.listen(this.startAnimation);
	}

	componentWillUnmount() {
		this.store.unlisten(this.startAnimation);
		}

		startAnimation() {
			if (this.state.isLoading && this.store.state.alert == false) {
				Animated.timing(
					this.growAnimated,
					{
						toValue: 1,
						duration: 600,
						easing: Easing.linear,
					}
				).start();
				setTimeout(() => {
				}, 3000);
			}
		}

	_onPress() {
		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
	}

	render() {
		const changeScale = this.growAnimated.interpolate({
			inputRange: [0, 1],
			outputRange: [1, SIZE],
		});

		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this._onPress}
          onPressOut={this.props.onPressOut}
					style={styles.button}
					activeOpacity={1}>
          <Icon style={styles.image} color="white" size={30} name="trash"/>
				</TouchableOpacity>
				<Animated.View style={[ styles.circle, {transform: [{scale: changeScale}]} ]} />
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
		alignItems: 'center',
		justifyContent: 'center',
		width: SIZE,
		height: SIZE,
		borderRadius: 100,
		zIndex: 99,
		backgroundColor: 'red',
	},
	circle: {
		height: SIZE,
		width: SIZE,
		marginTop: -SIZE,
		borderRadius: 100,
		backgroundColor: 'red',
	},
	image: {
	}
});

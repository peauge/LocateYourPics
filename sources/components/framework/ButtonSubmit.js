import React, { Component, PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
	Image,
	Alert,
	View,
	ActivityIndicator,
} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class ButtonSubmit extends Component {
	constructor(props) {
		super();

		this.store = props.store;
		this.state = {
			isLoading: false,
			isMounted: false,
		};

		this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this._onPress = this._onPress.bind(this);
		this.isNotLoading = this.isNotLoading.bind(this);
		this.stopAnimation = this.stopAnimation.bind(this);
	}

	componentDidMount() {
		this.state.isMounted = true;
		this.store.listen(this.stopAnimation);
	}

	componentWillUnmount() {
		this.state.isMounted = false;
		this.store.unlisten(this.stopAnimation);
		}

	stopAnimation() {
		this.setState({ isLoading: false });
		this.buttonAnimated.setValue(0);
		this.growAnimated.setValue(0);
		}

	isNotLoading() {
		this.setState({ isLoading: false });
	}

	_onPress() {
		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		Animated.timing(
			this.buttonAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();

		setTimeout(() => {
			this._onGrow();
		}, 2000);

	}

	_onGrow() {
		Animated.timing(
			this.growAnimated,
			{
				toValue: 1,
				duration: 600,
				easing: Easing.linear
			}
		).start();
	}

	render() {
		const changeWidth = this.buttonAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
	  });
	  const changeScale = this.growAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [1, 0]
	  });

		return (
			<View style={this.props.styleContainer ? this.props.styleContainer : styles.container}>
				<Animated.View style={{width: changeWidth}}>
					<TouchableOpacity style={this.props.style ? this.props.style : styles.button }
						onPress={this._onPress}
            onPressOut={this.props.onPressOut}
						activeOpacity={1} >
							{this.state.isLoading ?
								<ActivityIndicator animating={true} size="large" color="pink"/>
								:
								<Text style={styles.text}>{this.props.buttonText}</Text>
							}
					</TouchableOpacity>
					<Animated.View style={[ styles.circle, {transform: [{scale: changeScale}]} ]} />
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginBottom : 10
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#495c70',
		height: MARGIN,
		borderRadius: 20,
		zIndex: 100,
	},
	circle: {
		height: MARGIN,
		width: MARGIN,
		marginTop: -MARGIN,
		borderWidth: 1,
		borderColor: '#495c70',
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor: '#495c70',
	},
	text: {
		color: 'white',
		backgroundColor: 'transparent',
	},
	image: {
		width: 24,
		height: 24,
	},
});

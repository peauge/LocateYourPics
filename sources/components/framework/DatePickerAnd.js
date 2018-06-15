import React, { Component, PropTypes } from 'react';
import {
	StyleSheet,
  Text,
	View,
	Image,
	TouchableHighlight,
  DatePickerAndroid,
} from 'react-native';
import Styles               from 'components/styles.json';


var styles = StyleSheet.create(Styles);

export default class DatePickerAnd extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date(),
      displayDate: null,
		};

    if (this.props.value)
      this.state.date = new Date(this.props.value);
    this.openDatePicker = this.openDatePicker.bind(this);
	}

  openDatePicker() {
    DatePickerAndroid.open({
      date: this.state.date
    }).then((res) => {
      if (res.action !== DatePickerAndroid.dismissedAction) {
        this.setState({date : new Date(res.year, res.month, res.day)});
        this.props.onChange(this.state.date);
      }
    });
  }

	render() {
    this.state.displayDate = this.state.date.getDate() + " - " + (this.state.date.getMonth() + 1) + " - " + (this.state.date.getYear() + 1900);
		return (
			<View style={styles.container}>
      <TouchableHighlight onPress={() => this.openDatePicker()} >
        <Text style={styles.text}>
          {this.state.displayDate}
        </Text>
      </TouchableHighlight>
			</View>
		);
	}
}

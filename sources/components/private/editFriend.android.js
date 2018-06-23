import {View, ScrollView, Image, TouchableHighlight, StyleSheet, TextInput, Picker, KeyboardAvoidingView}       from "react-native";
import {Container, Header, Icon, Content, List, ListItem, Left, Thumbnail, Button, Body, Right, Switch, Footer, FooterTab, Text, StyleProvider, Form } from 'native-base';
import React              from "react";
import IconF 			        from "react-native-vector-icons/FontAwesome";
import ProfileStore       from 'stores/Profile.js';
import ProfileActions     from 'actions/Profile.js';
import ImagePicker        from 'react-native-image-crop-picker';
import SignForm           from 'framework/signForm.js';
import ButtonBack         from "framework/ButtonBack"
import Styles             from 'components/styles.json';

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations


export class EditFriend extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = ProfileStore.getState();
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    ProfileStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ProfileStore.unlisten(this.onChange);
  }

  onChange(store) {
    if (store.code == 200) {
      this.props.parent.setState({friend : false});
      return;
    }
    this.setState({code : store.code, msg : store.msg});
  }

  handleSubmit() {
    ProfileActions.editProfile(this.state.profile);
  }

  handleCancel() {
    this.props.parent.setState({friend : false});
  }

  handleChange(field) {
    this.setState({profile : field});
  }

	render() {
    var profile = this.state.profile;

		return (
        <View>
        <Button rounded light onPress={this.handleCancel} style={{marginTop : 30}}>
         <Icon name='arrow-back' />
       </Button>
        <Text>ADD LISTITEM FRIEND</Text>
        </View>
		);
	}
}

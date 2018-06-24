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


export class EditProfile extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = ProfileStore.getState();

    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.changePhoto  = this.changePhoto.bind(this);
  }

  componentDidMount() {
    ProfileStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ProfileStore.unlisten(this.onChange);
  }

  onChange(store) {
    if (store.code == 200) {
      this.props.parent.setState({edit : false});
      return;
    }
    this.setState({code : store.code, msg : store.msg});
  }

  handleSubmit() {
    ProfileActions.editProfile(this.state.profile);
  }

  handleCancel() {
    this.props.parent.setState({edit : false});
  }

  handleChange(field) {
    this.setState({profile : field});
  }

  changePhoto(choice) {
    if (choice == "cancel")
      return;
    if (choice == "camera") {
      ImagePicker.openCamera({
        width: 200,
        height: 300,
        cropping: true,
        includeBase64 : true
      }).then(image => {
        var newProfile = Object.assign({}, this.state.profile);
        newProfile.avatar = image.path;
        newProfile.photo = image;
        this.setState({profile : newProfile});
      });
    }
    else if (choice == "library") {
      ImagePicker.openPicker({
        width: 200,
        height: 300,
        cropping: true,
        includeBase64 : true
      }).then(image => {
        var newProfile = Object.assign({}, this.state.profile);
        newProfile.photoUrl = image.path;
        newProfile.photo = image;
        this.setState({profile : newProfile});
      });
    }
  }

	render() {
    var profile = this.state.profile;

		return (
          <Container>
          <Content>
          <ListItem style={styles.listItem}>
          <Left>
          <Button rounded light onPress={this.handleCancel} style={{marginTop : 30}}>
           <Icon name='arrow-back' style={{marginTop : 30}} />
         </Button>
         <Body>
         <Thumbnail  style={{width: 50, height: 50, marginTop : 30, alignSelf : "center", justifyContent : "center"}} source={profile && profile.avatar  && profile.avatar != 'eyJjb2RlIjoxLCJtZXNzYWdlIjpudWxsfQ==' ? {uri: profile.avatar} : require("images/avatar.png")}/>
         </Body>
         </Left>
          <Right>
          <Button rounded light onPress={this.handleSubmit} style={{marginTop : 30}}>
                     <Icon name='md-checkmark'  style={{marginTop : 30}} />
                   </Button>
          </Right>
          </ListItem>
            <Picker onValueChange={(itemValue) => this.changePhoto(itemValue)}>
              <Picker.Item label={I18n.t('Profile')['pickerLabel']} value="cancel" />
              <Picker.Item label={I18n.t('Profile')['pickerPhoto']} value="camera" />
              <Picker.Item label={I18n.t('Profile')['pickerDesktop']} value="library" />
              <Picker.Item label={I18n.t('Profile')['pickerCancel']} value="cancel" />
            </Picker>
            <SignForm
               formType={3}
               form={this.state.profile}
               value={this.state.profile}
               onChange={this.handleChange}
               />
         </Content>
        </Container>
		);
	}
}

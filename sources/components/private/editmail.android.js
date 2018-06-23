import {View, ScrollView, Image, TouchableHighlight, StyleSheet, TextInput, Picker, KeyboardAvoidingView}       from "react-native";
import { Container, Header, Content, List, ListItem, Text, Thumbnail, Body, Card, CardItem, Left, Right, Icon, Button } from 'native-base';
import React              from "react";
import IconF 			        from "react-native-vector-icons/FontAwesome";
import SignForm           from 'framework/signForm.js';
import ButtonSubmit       from "framework/ButtonSubmit";
import ButtonBack         from "framework/ButtonBack"
import Styles             from 'components/styles.json';
import AccountActions     from 'actions/Account.js';
import User               from 'stores/Account.js';


var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class EditMail extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = User.getState();

    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    User.listen(this.onChange);
  }

  componentWillUnmount() {
    User.unlisten(this.onChange);
  }

  onChange(store) {
    if (store.code == 200) {
      this.props.parent.setState({mail : false});
      return;
    }
  }

  handleSubmit() {
    AccountActions.updateMail(this.state);
  }

  handleCancel() {
    this.props.parent.setState({mail : false});
  }

  handleChange(field) {
    this.setState({mailForm : field});
  }

	render() {

    //console.log("render EDIT MAIL:", this.state);
		return (
      <Container style={styles.containerPassword}>
      <Container style={{flex : 3}}>
      <Content style={{marginTop : 10, marginLeft : 5, marginRight : 5, marginBottom : 10}}>
      <Text style={{alignSelf : "center", fontSize : 18, color : "white", marginTop : 5, marginBottom : 5}}>{I18n.t('Setting')['upMail']}</Text>
      <SignForm
        formType={6}
        form={this.state.mailForm}
        value={this.state.mailForm}
        onChange={this.handleChange}
        />
      </Content>
      </Container>
      <Container style={{flex : 2}}>
      <Content style={{marginLeft : 5, marginRight : 5, marginBottom : 10}}>
      <Button style={{marginLeft : 10, marginRight : 10, backgroundColor : "#495c70"}} iconRight block onPressOut={this.handleSubmit}>
        <Text>{I18n.t('Setting')['submit']}</Text>
        <Icon name='md-cog' />
      </Button>
      <ButtonBack onPressOut={this.handleCancel} />
      </Content>
      </Container>
      </Container>
		);
	}
}

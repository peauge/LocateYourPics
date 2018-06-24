import {StyleSheet, Text, View, KeyboardAvoidingView}   from "react-native";
import React                from "react";
import AccountActions       from 'actions/Account.js';
import User                 from 'stores/Account.js';
import ButtonSubmit         from "framework/ButtonSubmit";
import SignForm             from "framework/signForm.js"
import Styles               from 'components/styles.json';
import {NavigationActions}  from 'react-navigation';
import ErrorAlert           from "framework/ErrorAlert.js"

//import ProfileActions   from '../actions/Profile.js';''

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

const signin = I18n.t('Button')['signin'];

export class SignInForm extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.errorAlert = new ErrorAlert();

    this.state = {
     	User : {
       	email		  : "",
       	password 	: ""
      },
      res : {
        code : '',
        msg  : '',
        origin : ''
      },
      alert : false
   	}

    // You must to bind the members functions here
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange     = this.onChange.bind(this);

  }

  componentDidMount() {
    User.listen(this.onChange);
  }

  componentWillUnmount() {
    User.unlisten(this.onChange);
  }

  onChange(user) {
    if (user.code === 0 && user.account != null) {
      const connectionAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Connected' })
        ]
      });
      this.props.parent.props.navigation.dispatch(connectionAction);
      return;
    }
    var state = Object.assign({}, this.state);
    state.alert = user.alert;
    state.res.origin = user.origin;
    state.res.code = user.code;
    state.res.msg = user.msg;
    this.setState(state);
  }

  handleSubmit() {
  AccountActions.requestSignin(this.state.User);
  }

  handleChange(field){
   	this.setState({User : field, alert : false});
  }

  render(){

    var alert = null;
    if (this.state.res.code != '') {
      if (this.state.res.code === 0) {
      }
      else {
        if (this.state.alert === true) {
          this.errorAlert.checkError(this.state.res);
        }
      }
    }

    return(
      <KeyboardAvoidingView behavior='padding'
				style={styles.containerSignin}>
        <View style={styles.inputs}>
          <SignForm
          formType={0}
          form={this.state.User}
          value={this.state.User}
          onChange={this.handleChange}
          />
        {alert}
      </View>
      <ButtonSubmit buttonText={signin} store={User} onPressOut={this.handleSubmit}/>
      </KeyboardAvoidingView>
    );
 	}
}

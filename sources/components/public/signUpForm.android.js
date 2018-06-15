import {StyleSheet, View, Text, KeyboardAvoidingView}  from "react-native";
import React                from "react";
import AccountActions       from 'actions/Account.js';
import User                 from 'stores/Account.js';
import ButtonSubmit          from "framework/ButtonSubmit";
import SignForm             from "framework/signForm.js"
import Styles               from 'components/styles.json';
import {NavigationActions}  from 'react-navigation';
import ErrorAlert           from "framework/ErrorAlert.js"

//import ProfileActions   from '../actions/Profile.js';

const t = require('tcomb-form-native');
let Form = t.form.Form;


var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

const signin = I18n.t('Button')['signin'];


export class SignUpForm extends React.Component{

  constructor(props, context) {
    super(props, context);

    //console.log("*", User.getState().account);
    this.errorAlert = new ErrorAlert();
    this.state = {
     	User : {
        firstName  : "",
        lastName  : "",
        email     : "",
        password  : "",
      },
      res : {
        code : '',
        msg  : '',
        origin   : '',
      },
      alert : false,
   	}

    // You must to bind the members functions here
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange     = this.onChange.bind(this);
  }

  componentDidMount() {
    //User.listen((user, that) => this.onChange(user, this));
    User.listen(this.onChange);
  }

  componentWillUnmount() {
    User.unlisten(this.onChange);
  }

  onChange(user) {
  //  console.log("onChange", user.code);
    if (user.code === 0 && user.account != null && user.isGuide != null) {
      //console.log("!!! Connection !!!")
      //AccountActions.getAccount.defer(user.id);
      //this.props.parent.setState({connected : true});
      const connectionAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Connected' })
        ]
      });
      this.props.parent.props.navigation.dispatch(connectionAction);
      //this.props.parent.props.navigation.navigate("Connected");
      return;
    }
    var state = Object.assign({}, this.state);
    state.alert = user.alert;
    state.res.origin = user.origin;
    state.res.code = user.code;
    state.res.msg = user.msg;
    //console.log("onChange2", state);
    this.setState(state);
  }


  handleSubmit() {
    // TODO : Check email and password
    console.log("handleSubmit");
    // setTimeout(() => { AccountActions.requestSignup(this.state.User); }, 600);
    AccountActions.requestSignup(this.state.User);
  }

  handleChange(field){
   	this.setState({User : field, alert : false});
  }

  render(){

      var alert = null;
      console.log("Response : ", this.state.res.code)
      if (this.state.res.code != '') {
        if (this.state.res.code === 0) {
          // TODO : Popup Validation
          //alert = <Text style = {styles.successMessages}> {this.state.res.msg} </Text>;
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
             formType = {1}
             form     = {this.state.User}
             value    = {this.state.User}
             onChange = {this.handleChange}
             />
        {alert}
    	</View>
      <ButtonSubmit buttonText={signin} store={User} onPressOut={this.handleSubmit}/>
      </KeyboardAvoidingView>
    );
 	}
}

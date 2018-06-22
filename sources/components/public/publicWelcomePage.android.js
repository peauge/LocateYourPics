import {StyleSheet, NativeModules, Animated, ToastAndroid, View, ScrollView, StatusBar, Text, ActivityIndicator}  from "react-native";
import React                    from "react";
import {SignInForm}	          	from "./signInForm.android.js";
import {SignUpForm}	           	from "./signUpForm.android.js";
import PrivateWelcomePage     	from "components/private/privateWelcomePage.android.js";
import SegmentedControlAndroid  from "framework/SegmentedControlAndroid.js"
import Styles   		           	from 'components/styles.json'
//import * as Keychain            from 'react-native-keychain';
import AccountActions           from 'actions/Account.js';
import AccountStore             from 'stores/Account.js';
import {NavigationActions}      from 'react-navigation';
import Wallpaper                from 'framework/Wallpaper.js'
import WallpLogin               from 'images/wallpaperlogin.png'
import WallpSignup              from 'images/wallpapersignup.png'


// import ErrorAlert 		 	from "./ErrorAlert";

var styles = StyleSheet.create(require("components/styles.json"));

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

// Get the locale variable to display content in the smartphone language
var deviceLocale = NativeModules.RNI18n.locale.split("_")[0];

export class PublicWelcomePage extends React.Component{
  constructor(props, context) {
        super(props, context);

        // this.errorAlert = new ErrorAlert();
        this.state = {
            bounceValue: new Animated.Value(0),
			      //connected 	  : false,
            selectedIndex : 0,
			      lang 		      : deviceLocale
		};
		//this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
	}

  componentWillMount() {
    // Get the current connection if it exist
    if (AccountStore.getState().account != null) {
      console.log("!! Retake connection !!");
      const connectionAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Connected' })
        ]
      });
      this.props.navigation.dispatch(connectionAction);
    }
  }

  onSelectPosition(event){
    console.log(event);
    ToastAndroid.show('segment '+event.selected, ToastAndroid.SHORT)
  }

animatedStart(value) {
  this.state.bounceValue.setValue(value);
  Animated.spring(
      this.state.bounceValue,
      {
          toValue: 0.8,
          friction: 1,
      }
  ).start();
}

  signChangeShow(){
    this.animatedStart(1);
    return(this.setState({selectedIndex: this.state.selectedIndex == 0 ? 1 : 0}));
  }

	render(){
		console.log("WelcomePageRender");

		// TODO : style dans le json a metre
    // TODO : Prendre en compte MODE HORIZONTAL avec dimension ex : ButtonLoading
		return (
  			<View style={{
  				backgroundColor	: "#2196F3",
  				flex			: 1,
  				}}>
          <Wallpaper source={this.state.selectedIndex == 1 ? WallpSignup : WallpLogin }>
            <ScrollView>

      				<StatusBar backgroundColor="#1565C0" barStyle="light-content"/>
      				<Animated.Image
      					source={require('images/resizelogo.png')}
      					style={{
      						flex		    : 1,
      						transform	  : [{scale: this.state.bounceValue},],
      						alignSelf 	: "center",
      						alignItems 	: "center",
      						}}
      					resizeMode 	= "contain"
      				/>
              <View style={{
              justifyContent : "flex-end",
                }}>
        					{this.state.selectedIndex == 1 ? <SignUpForm parent={this} lang={this.state.lang}/> :
                    <SignInForm parent={this} lang={this.state.lang}/>}
                    </View>

      				{/*TODO : utiliser SegmentedControllIOS pour IOS ?*/}
              {/*TODO : Mettre le Segment control en bas de la page ! ?*/}
          </ScrollView>
          <SegmentedControlAndroid
            values        = {[I18n.t('Login')['login'], I18n.t('Register')['register']]}
            selectedIndex = {this.state.selectedIndex}
            onChange      = {this.signChangeShow.bind(this)}
            style         = {{height: 50, marginBottom: 0}}/>
            </Wallpaper>
  			</View>
		);
  }
    componentDidMount() {
      this.animatedStart(1.5);
    }
}

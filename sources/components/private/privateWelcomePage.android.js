import {StyleSheet, TextInput, View, AppRegistry, BackHandler, Image, DrawerLayoutAndroid}   from "react-native";
import RN from "react-native";
import {Container, Header, Icon, Content, List, ListItem, Left, Thumbnail, Body, Right, Switch, Footer, FooterTab, Button, Text, StyleProvider } from 'native-base';
import {StackNavigator, TabNavigator, NavigationActions} from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import React     	      from "react";
import IconF 			      from "react-native-vector-icons/FontAwesome";
import IconI 			      from "react-native-vector-icons/Ionicons";
import {Welcome}				from "./welcome.android.js";
import {Settings} 			from "./settings.android.js";
import {Profile}				from "./profile.android.js";
import {Pictures}				from "./pictures.android.js";
import {PictureView}     from './FullDisplayedPicture.android.js'
import {ProfileView}    from './FullDisplayedProfile.android.js';
import logo 						from 'images/logo.png';
import LocationStore	  from 'stores/Location.js';
import AccountStore     from 'stores/Account.js'
import ProfileStore			from 'stores/Profile'
import Styles           from 'components/styles.json'
import AccountActions   from 'actions/Account.js';
import PictureActions   from 'actions/Pictures.js';
import getTheme 				from 'components/native-base-theme/components';
import platform 				from 'components/native-base-theme/variables/platform';
import CreateClass 			from 'create-react-class';

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

var MapViews = StackNavigator({
	Results : { screen: Welcome, navigationOptions: {header : null}},
	Profile : { screen: ProfileView },
	Picture  : { screen: PictureView },
});

export class PrivateWelcomePage extends React.Component{

	constructor(props, context) {
		super(props, context);
    this.state = {
      activeModule 	: "Welcome",
      modalVisible	: false,
      dropdown 			: "dropdown"
    }
		this.handleBack = this.handleBack.bind(this);
		this.onChangeAccount = this.onChangeAccount.bind(this);
		this.toggleModule = this.toggleModule.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
		this.openMenu = this.openMenu.bind(this);
		this.logout = this.logout.bind(this);
		this.navigationView = this.navigationView.bind(this);
		this.onActionSelected = this.onActionSelected.bind(this);
		this.takePhoto = this.takePhoto.bind(this);
  }

  handleBack() {
    if (this.state.activeModule != "Welcome") {
      this.toggleModule("Welcome");
      return true;
    }
    console.log('exit');
    return false;
  }

	onChangeAccount(store) {
		if (store.code == null && store.account == null) {
			const logoutAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: 'Unconnected'})
				]
			});
			this.props.navigation.dispatch(logoutAction);
		} else if (store.isBlocking == true && store.whatChange == 'isBlocking') {
			store.whatChange = "no";
		}
	}


	takePhoto(choice) {
			console.log("Choice : ", choice);
			if (choice == "camera") {
				console.log("Camera !!!!");
				ImagePicker.openCamera({
					width: 200,
					height: 300,
					cropping: true,
					includeBase64 : true
				}).then(image => {
					var location = LocationStore.getState().location;
					var userId = AccountStore.getState().account.id;
					console.log("BEFORE CREATE user + location + img", userId, JSON.stringify(location)["latitude"], image);
					PictureActions.createPicture(image, location, userId);
				// TODO : set photo with coordonate on the map

				});
			}
		}

	componentDidMount() {
		AccountStore.listen(this.onChangeAccount);
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
		AccountStore.unlisten(this.onChangeAccount);
		this._drawer = null;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

	toggleModule(module) {
		if (this._drawer !== null) {
			this.setState({activeModule : module});
			this._drawer.closeDrawer();
		}
	}

	togglePopup() {
		if (this._drawer !== null) {
			var state = Object.assign({}, this.state);
			state.dropdown == "dropdown" ? state.dropdown += " open" : state.dropdown = "dropdown";
			this.setState(state);
		}
	}

	openMenu() {
		this._drawer.openDrawer();
	}

	logout() {
    AccountActions.requestSignout();

	}

	navigationView() {
		return (
			<Profile lang={this.props.lang} parent={this} navigation={this.props.navigation}/>
		);
	}

	onActionSelected(position) {
		if (position === 0) {
			this.props.navigation.navigate('Search');
			this.props.navigation.dispatch('Search');
		}
		else if (position === 1) {
			this.takePhoto("camera");
		}
	}


	render() {
		console.log('RenderPrivateWelcomePage')
		var modules = {
			Welcome 			: <MapViews	  screenProps={{"parent" : this, "lang" : this.props.lang}}/>,
			Profile 			: <Profile 				lang={this.props.lang} parent={this}/>,
      Settings 		: <Settings			lang={this.props.lang}/>,
			Pictures		: <Pictures lang={this.props.lang}/>
		};

		var modulesIcon = {
			Welcome 			: "md-map",
			Settings			: "md-cog",
			Pictures			: "md-image"
		}

		var advIcon = this.state.activeModule == "Pictures" ? <Button active vertical><Icon active name="md-image"/><Text>{I18n.t('Button')['Picture']}</Text></Button> : <Button onPress={() => this.toggleModule("Pictures")} vertical><Icon name="md-image"/><Text>{I18n.t('Button')['Picture']}</Text></Button>
		var mapIcon = this.state.activeModule == "Welcome" ? <Button active vertical><Icon active name="map"/><Text>{I18n.t('Button')['map']}</Text></Button> : <Button onPress={() => this.toggleModule("Welcome")} vertical><Icon name="map"/><Text>{I18n.t('Button')['map']}</Text></Button>
		var settingIcon = this.state.activeModule == "Settings" ? <Button active vertical><Icon active name="cog"/><Text>{I18n.t('Button')['setting']}</Text></Button> : <Button onPress={() => this.toggleModule("Settings")} vertical><Icon name="cog"/><Text>{I18n.t('Button')['setting']}</Text></Button>
		var expanded = false;
		if (this.state.dropdown != "dropdown") {
			expanded = true;
		}
		var toolbarActions = [
			{
				title 		: 'search',
				iconName 	: 'md-search',
				show 			: 'always'
			},
			{
				title 		: 'camera',
				iconName 	: 'md-camera',
				show 			: 'always'
			},
		];
		return (
			<DrawerLayoutAndroid
				drawerWidth 							= {300}
				drawerPosition 						= {DrawerLayoutAndroid.positions.Left}
				renderNavigationView 			= {() => this.navigationView()}
				statusBarBackgroundColor 	= "#495c70"
				style 										= {styles.drawer}
				ref 											= {(ref) => this._drawer = ref}>

			  	<View style={{ flex: 1 }}>
			  		<IconI.ToolbarAndroid
			  			title				      = {this.state.activeModule == "Welcome" ? I18n.t('Button')['map'] :
																	this.state.activeModule == "Settings" ? I18n.t('Button')['setting'] :
																	this.state.activeModule == "Pictures" ? I18n.t('Button')['Picture'] : null
							}
			  			navIconName			  = {modulesIcon[this.state.activeModule]}
			  			onIconClicked 		= {() => this.openMenu()}
			  			iconColor			    = "white"
			  			titleColor 			  = "white"
			  			actions 			    = {toolbarActions}
			  			onActionSelected 	= {(position) => this.onActionSelected(position)}
						  overflowIconName 	= "md-add"
			  			style 				    = {styles.toolbar}
						/>
			  		{modules[this.state.activeModule]}
						<StyleProvider style={getTheme(platform)}>
						<Footer>
							<FooterTab>
								{mapIcon}
								{settingIcon}
								{advIcon}
          		</FooterTab>
						</Footer>
						</StyleProvider>
					 </View>
			</DrawerLayoutAndroid>
		);
	}
}

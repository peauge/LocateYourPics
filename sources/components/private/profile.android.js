import {View, ScrollView, Alert, Image, TouchableHighlight, StyleSheet}  from "react-native";
import React            from "react";
import {Container, Header, Icon, Content, List, ListItem, Left, Thumbnail, Body, Right, Switch, Footer, FooterTab, Button, Text, StyleProvider } from 'native-base';
import StarRating 			from 'react-native-star-rating';
import {EditProfile}    from './editProfile.android.js'
import {EditFriend}    from './editFriend.android.js'
import ProfileStore     from 'stores/Profile.js';
import ProfileActions   from 'actions/Profile.js';
import Styles           from 'components/styles.json';
import ErrorAlert       from 'framework/ErrorAlert.js'
import Avatar           from 'react-native-elements';

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations


export class Profile extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = ProfileStore.getState();

    this.errorAlert = new ErrorAlert();
    this.state.edit = false;
    this.state.friend = false;
    this.state.alert = false;

    this.handleEdit         = this.handleEdit.bind(this);
    this.handleFriend       = this.handleFriend.bind(this);

    this.onChange           = this.onChange.bind(this);
  }

  componentDidMount() {
    ProfileStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ProfileStore.unlisten(this.onChange);
  }

  onChange(profile) {
    var state = Object.assign({}, this.state);

    state = ProfileStore.getState();
    state.alert = profile.alert;
    state.code = profile.code;
    state.msg = profile.msg;
    state.origin = profile.origin;
    this.setState(state);
}

  handleEdit() {
    this.setState({edit : true});
  }

  handleFriend() {
    this.setState({friend : true});
  }

  render(){
    var content = null;
		var profile = this.state.profile;

			content =  <ListItem style={styles.listItem} icon onPress={this.handleFriend}>
					<Left>
						<Icon name="md-walk" />
					</Left>
					<Body>
						<Text>{I18n.t('Profile')['up']}</Text>
					</Body>
					<Right/>
				</ListItem>;

    let buttonGuide = null;
    if (this.state.edit == true) {
      return(<EditProfile parent={this}/>);
    }
    if (this.state.friend == true) {
      return(<EditFriend parent={this}/>);
    }

    return (
      <Container>
      	<Content>
        <View style={{ backgroundColor: '#495c70'}}>
           <Thumbnail large  style={{width: 160, height: 160, marginTop : 30, alignSelf : "center"}} source={profile && profile.avatar  && profile.avatar != 'eyJjb2RlIjoxLCJtZXNzYWdlIjpudWxsfQ==' ? {uri: profile.avatar} : require("images/avatar.png")}/>
           <Text style={{fontSize : 22, marginLeft : 5, marginTop : 10, marginBottom : 5, alignSelf : "center", color : "white"}}>{profile && profile.first_name ? profile.first_name : "FirstName"} {profile && profile.last_name ? profile.last_name : "LastName"}</Text>
           <Text style={{fontSize : 16, marginLeft : 5, marginBottom : 5, alignSelf : "center", color : "white"}}>{profile && profile.city ? profile.city : ""}{profile && profile.country ? (profile.city ? ", " + profile.country : profile.country)  : ""}</Text>

        </View>
      	<View >
      		<List>
      		<ListItem style={styles.listItem} icon onPress={this.handleEdit}>
      			<Left>
      				<Icon name="md-brush" />
      			</Left>
      			<Body>
      				<Text>{I18n.t('Profile')['profile']}</Text>
      			</Body>
      			<Right>
      				<Text>{I18n.t('Profile')['edit']}</Text>
      				<Icon name="arrow-forward" />
      			</Right>
      		</ListItem>
      		{content}
      		</List>
      	</View>
      	</Content>
      </Container>
    );
  }
}

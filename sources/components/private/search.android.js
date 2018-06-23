import { View, TextInput, StyleSheet, BackHandler } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Thumbnail, Body, Item, Input, Icon, Picker, CheckBox } from 'native-base';
import React 				      from 'react';
import {PictureResults, ProfileResults}	from './searchResults.android.js';
import {StackNavigator, TabNavigator, NavigationActions, TabView} from 'react-navigation';
import SearchActions    from 'actions/Search.js';
import {PictureView}     from './FullDisplayedPicture.android.js';
import {ProfileView}    from './FullDisplayedProfile.android.js';
import Styles           from 'components/styles.json'

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class Search extends React.Component{

	constructor(props, context) {
    super(props, context);

    this.state =  {
			searchInput : null,
      routeName   : "Picture",
   	}
		this._onSearchChange = this._onSearchChange.bind(this);
  }

	_onSearchChange(search) {
		if (search != "") {
			SearchActions.requestSearch(search);
		}
	}

  render(){
    		return (
          <Container>
          <Item>
           <Icon name="md-search" style={{marginLeft : 15}} />
           <Input placeholder          = {I18n.t('Search')['search']}
                      value            = {this.state.searchInput}
                      onChangeText     = {(value) => this._onSearchChange(value)} />
         </Item>
			  <ProfileResults/>
			</Container>
		);
	}
}

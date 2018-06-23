import { Button, Modal, TouchableHighlight, View, StyleSheet, ListView, Image } from 'react-native';
import React, { Component } from 'react';
import Search               from 'stores/Search.js';
import Picture               from 'stores/Pictures.js';
import Styles               from 'components/styles.json'
import SearchActions        from 'actions/Search.js'
import { Container, Header, Content, List, ListItem, Text, Thumbnail, Body, Item, Picker, Card, CardItem } from 'native-base';


var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class ProfileResults extends Component {
  static navigationOptions = {
      tabBarLabel: 'Profiles'
    };

  constructor(props, context) {
    super(props, context);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        ds          : ds,
        dataSource  : null,
        filter      : "none"
      }
    this.onChange = this.onChange.bind(this);
    this.validURL = this.validURL.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);

  }

  componentDidMount() {
    Search.listen(this.onChange);
  }

  componentWillUnmount() {
    Search.unlisten(this.onChange);
  }

  onChangeFilter(value) {
    SearchActions.changeFilterPr(value);
    this.setState({filter : value});
  }

  onChange(search) {
    if (search["profiles"] == [] || search["profiles"] == '')
      this.setState({dataSource : null});
    else
      this.setState({dataSource : this.state.ds.cloneWithRows(search["profiles"])})
  }

  validURL(str) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
   if(!regex.test(str)) {
     return false;
   } else {
     return true;
   }
  }

  render() {
    var result = null;
    if (this.state.dataSource == null)
      result = <Text>{I18n.t('Search')['no']}</Text>;
    else {
      result = <List dataArray={this.state.dataSource._dataBlob.s1}
                renderRow={(rowData) =>
                  <ListItem style={styles.listItem} key={"searchedProfile" + rowData._id}  onPress={() => this.props.navigation.navigate('Profile', {data : rowData})}>
                        <Thumbnail square large source={{ uri: this.validURL(rowData.photoUrl) ? rowData.photoUrl : "https://www.pickaguide.fr/assets/images/avatar.png" }} />
                        <Body>
                            <Text>{rowData.displayName}</Text>
                            <Text note>{rowData.description}</Text>
                            <Text note>{rowData.age + I18n.t('Search')['age']}</Text>
                        </Body>
                  </ListItem>
                }>
      </List>;
    }
    return (
      <View style={{flex: 1}}>
      <View style={{flex: 1}}>
      <Picker selectedValue={this.state.filter} onValueChange={(value) => {this.onChangeFilter(value)}}>
      <Item label={I18n.t('Search')['filter']} value="none" />
      <Item label={I18n.t('Setting')['mail']} value="interests" />
      <Item label={I18n.t('Search')['city']} value="city" />
      <Item label={I18n.t('Search')['country']} value="country" />
      <Item label={I18n.t('Search')['name']} value="displayName" />
      </Picker>
      </View>
      <View style={{flex:5}}>
      {result}
      </View>
      </View>
    );
  }
}

import {View, Modal, TouchableHighlight, Alert, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView} from "react-native";
import React           from "react";
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Separator, Form, Picker, Item } from 'native-base';

import Styles          from 'components/styles.json';
import IconF 			     from "react-native-vector-icons/FontAwesome";
import User            from 'stores/Account.js';
import ButtonLoading      from "framework/ButtonLoading";
import ButtonBack         from "framework/ButtonBack"
import AccountActions  from 'actions/Account.js';
import SignForm        from 'framework/signForm.js';
import ButtonDelete    from "framework/ButtonDelete.js"
import {EditPassword}  from "./editpassword.android.js"
import {EditMail}      from "./editmail.android.js"

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class Settings extends React.Component{

constructor(props, context) {
    super(props, context);

    //console.log("*", User.getState().account);
    this.state = {
     	User : User.getState(),
      res : {
        code : '',
        msg  : ''
      },
      mail : false,
      password : false,
      modalVisible : true,
      currency : "eur",
   	}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitChanges = this.handleSubmitChanges.bind(this);
    this.handleMailChanges = this.handleMailChanges.bind(this);
    this.handlePasswordChanges = this.handlePasswordChanges.bind(this);
    this.handleSubmitSuppression = this.handleSubmitSuppression.bind(this);
    this.logout = this.logout.bind(this);
    this.updateNotification = this.updateNotification.bind(this);
    this.triggerAlertDelete = this.triggerAlertDelete.bind(this);
    this.triggerAlertLogout = this.triggerAlertLogout.bind(this);

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    User.listen(this.onChange);
  }

  componentWillUnmount() {
    //console.log("WILL UNMOUNT PARAM");
    User.unlisten(this.onChange);
  }

  onChange(user) {
    //console.log("onChange", user);
    var state = Object.assign({}, this.state);
    state.User = user;
    this.setState(state);
  }

  handleSubmitSuppression() {
    AccountActions.requestDelete(this.state);
  }

  handleSubmitChanges() {
    /// A vérifier
    AccountActions.requestSignin(this.state);
  }

  handlePasswordChanges() {
  this.setState({password : true});
  }

  handleMailChanges() {
  this.setState({mail : true});
  }

  handleChange(field){
   this.setState({User : field});
  }

  logout() {
    AccountActions.requestSignout();
  }

  updateNotification() {
    AccountActions.updateNotification(this.state.User.notification == true ? false : true)
  }

  triggerAlertLogout() {
    Alert.alert(
                      I18n.t('Setting')['logout'],
                    I18n.t('Setting')['logoutMsg'],
                          [
                              {text: I18n.t('Setting')['cancel'], style: 'cancel'},
                              {text: I18n.t('Setting')['disc'], onPress: this.logout},
                          ],
                          { cancelable: true }
                        );
  }

triggerAlertDelete() {
  Alert.alert(
                    I18n.t('Setting')['delete'],
                    I18n.t('Setting')['deleteMsg'],
                        [
                            {text: I18n.t('Setting')['cancel'], style: 'cancel'},
                            {text: I18n.t('Setting')['destroy'], onPress: this.handleSubmitSuppression},
                        ],
                        { cancelable: true }
                      );
}

	render(){
    if (this.state.mail == true) {
      return(<EditMail parent={this}/>);
    }
    else if (this.state.password == true) {
      return(<EditPassword parent={this}/>);
    }
		return (
      <Container>
        <Content>
          <List>
          <Separator bordered>
          <Text style={{fontSize : 14}}>{I18n.t('Setting')['account']}</Text>
          </Separator>
          <ListItem style={styles.listItem} icon onPress={this.handlePasswordChanges}>
            <Left>
              <Icon name="lock" />
            </Left>
            <Body>
              <Text>{I18n.t('Setting')['security']}</Text>
            </Body>
            <Right>
              <Text>{I18n.t('Setting')['pass']}</Text>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem style={styles.listItem} icon onPress={this.handleMailChanges}>
            <Left>
              <Icon name="mail" />
            </Left>
            <Body>
              <Text>{I18n.t('Setting')['id']}</Text>
            </Body>
            <Right>
              <Text>{I18n.t('Setting')['mail']}</Text>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem style={styles.listItem} icon onPress={this.triggerAlertDelete}>
            <Left>
              <Icon name="trash" />
            </Left>
            <Body>
              <Text>{I18n.t('Setting')['delete']}</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.listItem} icon>
            <Left>
              <Icon name="notifications" />
            </Left>
            <Body>
              <Text>{I18n.t('Setting')['notif']}</Text>
            </Body>
            <Right>
              <Switch value={this.state.User.notification} onValueChange={this.updateNotification} />
            </Right>
          </ListItem>
            <Separator bordered>
            <Text style={{fontSize : 14}}>{I18n.t('Setting')['signout']}</Text>
            </Separator>
            <ListItem style={styles.listItem} icon onPress={this.triggerAlertLogout}>
              <Left>
                <IconF name="power-off" color="black" size={25}/>
              </Left>
              <Body>
                <Text>{I18n.t('Setting')['logout']}</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
		);
	}
}

//
// <View style={styles.containerParameter}>
//   <View  style={styles.boxContainerParameter}>
//   <ButtonLoading styleContainer={[styles.boxContainerParameter, styles.boxOneParameter]} buttonText="Update my password" onPressOut={this.handlePasswordChanges}/>
//   <ButtonLoading styleContainer={[styles.boxContainerParameter, styles.boxOneParameter]} buttonText="Update my e-mail" onPressOut={this.handleMailChanges}/>
//   <View  style={[styles.boxContainerParameter, styles.boxTwoParameter]} >
//   </View>
//   <View  style={[styles.boxContainerParameter, styles.boxTwoParameter]} >
//   <SignForm
//         formType={4}
//         form={this.state.User}
//         value={this.state.User}
//         onChange={this.handleChange}
//         />
//   </View>
//     <ButtonDelete store={User} onPressOut={this.handleSubmitSuppression}/>
//   </View>
// </View>

// <View style={styles.containerParameter}>
//   <View  style={[styles.boxContainerParameter, styles.boxOneParameter]} >
//   <ButtonLoading buttonText="Modifier mon mot de passe" onPressOut={this.handlePasswordChanges}/>
//   <ButtonLoading buttonText="Modifier mon email" onPressOut={this.handleMailChanges}/>
//   </View>
//   <View  style={[styles.boxContainerParameter, styles.boxTwoParameter]} >
//   <Modal
//    animationType="slide"
//    transparent={false}
//    visible={this.state.modalVisible}
//    onRequestClose={() => {this.setState({displayModal : false})}}
//    >
//     <SignForm
//       formType={4}
//       form={this.state.User}
//       value={this.state.User}
//       onChange={this.handleChange}
//       />
//       <ButtonDelete onPressOut={this.handleSubmitSuppression}/>
//   </Modal>
//   </View>
//   <View style={[styles.boxContainerParameter, styles.boxThreeParameter]} >
//   <ButtonLoading buttonText="Supprimer mon compte" onPressOut={() => {this.setState({displayModal : true})}}/>
//   </View>
// </View>




// <View style={[styles.boxContainerParameter, styles.boxTwoParameter]}>
//   <ButtonLoading buttonText="Modifier mon mot de passe" onPressOut={this.handlePasswordChanges}/>
//   <ButtonLoading buttonText="Modifier mon email" onPressOut={this.handleMailChanges}/>
// </View>
// <View style={[styles.boxContainerParameter, styles.boxThreeParameter]}>
// <ButtonDelete onPressOut={this.handleSubmitSuppression}/>
// </View>

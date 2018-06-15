import {View, ListView, Image, Button, TouchableHighlight, StyleSheet}  from "react-native";
import React         from "react";
import StarRating 			from 'react-native-star-rating';
import IconF          from "react-native-vector-icons/FontAwesome";
import PictureActions from 'actions/Pictures.js';
import PictureStore   from 'stores/Pictures.js';
import ProfileActions from 'actions/Profile.js';
import ProfileStore  from 'stores/Profile.js';
import Styles        from 'components/styles.json';
import { Container, Header, Content, List, ListItem, Left, Right, Text, Thumbnail, Body, Card, CardItem, Icon } from 'native-base';

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class ProfileView extends React.Component{

  constructor(props, context) {
    super(props, context);

    //console.log("Profile displayed : ", this.props.navigation.state.params.data);
   /*if (typeof this.props.navigation.state.params.data._id === 'number')
      ProfileActions.getProfile(this.props.navigation.state.params.data);
    else*/
      PictureActions.getGuidePictures(this.props.navigation.state.params.data._id);
    const profile = this.props.navigation.state.params.data;
    const id      = this.props.navigation.state.params.data._id;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        profile     : profile,
        id          : id,
        ds          : ds,
        dataSource  : null,//ds.cloneWithRows(PictureStore.getState()["guidePictures"]),
      }

    this.onChangePicture = this.onChangePicture.bind(this);
    this.onChangeProfile = this.onChangeProfile.bind(this);
    this.goPictures = this.goPictures.bind(this);
    this.validURL = this.validURL.bind(this);
  }

  componentDidMount() {
    ProfileStore.listen(this.onChangeProfile);
    PictureStore.listen(this.onChangePicture);

  }

  componentWillUnmount() {
    ProfileStore.unlisten(this.onChangeProfile);
    PictureStore.unlisten(this.onChangePicture);
  }

  onChangePicture(Pictures) {
    //console.log("onChangePictures", Pictures["guidePictures"]);
    if (Pictures["guidePictures"] == [] || Pictures["guidePictures"] == '') {
      //console.log("datasource become null : ", Pictures["guidePictures"]);
      this.setState({dataSource : null});
    }
    else
      this.setState({dataSource : this.state.ds.cloneWithRows(Pictures["guidePictures"])})
  }

  onChangeProfile(profile) {
    if (this.state.dataSource == null && profile.otherProfile != null) {
      //console.log("OnChangeProfile OtherProfile");
      PictureActions.getGuidePictures.defer(profile.otherProfile._id);
    }
    this.setState({"profile" : profile});
  }

  goPictures(rowData) {
    this.props.navigation.navigate('Picture', {data : rowData});
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


  render(){
    var profile = this.state.profile.profile ? this.state.profile.profile : this.state.profile;
    var photo = profile.photoUrl ? profile.photoUrl : profile.data;
    var name = profile.displayName ? profile.displayName  : profile.firstName;
    var city = profile.city;
    var profileDisplay = null;
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var age = 0;
    var Pictures = null;
    var rate = null;
    var p = null;

    if (!photo) {    }
    //console.log("Render FullDisplayedProfile: INFO !!!", this.state.profile, "=================>",  this.props.navigation.state.params.data, "STOOOOOOOOOOOP");
    if (this.state.profile.isGuide)
      Pictures = <Text>{I18n.t('Picture')['guideNoAd']}</Text>;

    if (this.state.dataSource !=   null)
      Pictures =  <List dataArray={this.state.dataSource._dataBlob.s1}
                  renderRow={(rowData) =>
                    {
                    return <ListItem style={styles.listItem} key={"searchedPicture" + rowData._id}  onPress={() => this.props.navigation.navigate('Picture', {data : rowData})}>
                          <Thumbnail square large source={rowData.photos ? rowData.photos[0] : { uri : "https://www.pickaguide.fr/assets/images/deleted.png"} } />
                          <Body>
                              <Text>{rowData.title}</Text>
                              <Text note>{rowData.description}</Text>
                          </Body>
                    </ListItem>
                  }}>
        </List>;
        // TDOD : if profile

    if (profile.rate) {
      rate = <StarRating
          disabled={true}
          maxStars={5}
          starSize={10}
          halfStarEnabled={true}
          starColor="#e7711b"
          rating={profile.rate}/>;
    }

    profileDisplay = <Card style={{flex: 0}}>
                          <CardItem>
                              <Left>
                                <Thumbnail source={ photo ?  { uri: "data:image/png;base64," + photo } : require("images/avatar.png")} />
                                <Body>
                                  <Text>{name}</Text>
                                  <Text>{city}</Text>
                                  <View style={{alignSelf : "flex-start"}}>
                                  {rate}
                                  </View>
                                </Body>
                              </Left>
                            </CardItem>
                            <CardItem>
                              <Body>
                                <Text>
                                  {profile.description}
                                </Text>
                              </Body>
                          </CardItem>
                        </Card>
    return (
        <Container>
        <Content>
          {profileDisplay}
          {Pictures}
          </Content>
        </Container>
    );
  }
}

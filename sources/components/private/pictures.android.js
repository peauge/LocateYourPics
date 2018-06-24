import { Modal, TouchableHighlight, View, StyleSheet, ListView, Image, ImageBackground, TextInput, Picker, DeviceEventEmitter } from 'react-native';
import { Container, Header, Button, Content, Icon, List, ListItem, Text, Thumbnail, Card, CardItem, Left, Right, Body} from 'native-base';
import React, { Component } from 'react';
import PictureActions        from 'actions/Pictures.js';
import PictureStore          from 'stores/Pictures.js';
import Styles               from 'components/styles.json';
import ErrorAlert           from 'framework/ErrorAlert.js'
import IconF 			          from "react-native-vector-icons/FontAwesome";
import ButtonBack           from "framework/ButtonBack"
import ButtonDelete         from "framework/ButtonDelete.js"
import SignForm             from 'framework/signForm.js';
import ImagePicker          from 'react-native-image-crop-picker';
import {ChooseNewAdAddress} from './chooseNewAdAddress.js';
import PhotoGrid            from 'react-native-thumbnail-grid';
import {PhotosGallery}	  	from "components/private/photosGallery.android.js";

var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class Pictures extends Component {
    constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
        store: PictureStore.getState(),
        ds          : ds,
        dataSource  : null,
        gallerySource : null,
        Picture : {
          photos : [],
          location : null,
        },
      }
    this.onChange = this.onChange.bind(this);
    this.showGallery = this.showGallery.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  componentDidMount() {
    PictureStore.listen(this.onChange);
    DeviceEventEmitter.addListener('GalleryBack', (e) => this.setState({displayModal : true, isGallery : false}));
  }

  componentWillUnmount() {
    PictureStore.unlisten(this.onChange);
  }

  onChange(Pictures) {
    this.setState({store : PictureStore.getState()})
  }


  deleteImage(id) {
    PictureActions.deletePicture(id);
  }

  showGallery(source) {
     this.setState({displayModalGallery : true, gallerySource : {sources : this.state.Picture.photos, initialPage : source.index, deleteImage: this.deleteImage}});
  }

  render() {
    var form = null;
    var pictures = null;
    if (this.state.store.Pictures.length > 0) {
      pictures = <List>
      {this.state.store.Pictures.map((rowData, index) => (
              <ListItem style={styles.listItem}>
                  <Thumbnail square large source={ rowData[index].url ? {uri : rowData[index].url} : {uri : "https://www.iconsdb.com/icons/preview/black/delete-xxl.png"}}/>
                  <Button style={{marginLeft : 50}} iconLeft block danger onPress={() => this.deleteImage(rowData[index].id)}>
                    <Icon name='md-trash' />
                    <Text>DELETE</Text>
                  </Button>
              </ListItem>
                  ))}
            </List>
  }
  else {
    pictures =
      <Content>
        <Card>
          <CardItem>
          <Body>
            <Text>{I18n.t('Picture')['noPicture']}</Text>
          </Body>
          </CardItem>
        </Card>
      </Content>;
  }

  return (
      <Container>
        <Content>
        {pictures}
        </Content>
      </Container>
    );
  }
}

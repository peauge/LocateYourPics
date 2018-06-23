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
        displayModal : false,
        displayModalGallery : false,
        gallerySource : null,
        displayModalAddress : false,
        Picture : {
          photos : [],
          location : null,
        },
        active : false,
        _id : -1,
      }
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setPicturePoint = this.setPicturePoint.bind(this);
    this.changePhotos = this.changePhotos.bind(this);
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
    this.setState({dataSource  : PictureStore.getState()["Pictures"] != [] ? this.state.ds.cloneWithRows(PictureStore.getState()["Pictures"]) : null})
  }

  create() {
    PictureActions.createPicture(this.state.Picture);
    this.setState({displayModal : false, _id : -1, Picture : {
    photos : [], location : null}});
  }

  delete() {
    PictureActions.deletePicture(this.state._id);
    this.setState({displayModal : false, _id : -1, Picture : {
    photos : [], location : null}});
  }

  toggle() {
    PictureActions.togglePicture({id : this.state._id, active : this.state.active});
    this.setState({displayModal : false, _id : -1, Picture : {
    photos : [], location : null}});
  }

  handleChange(field) {
    this.setState({Picture : field});
  }

  setPicturePoint(newPoint) {
    var newPicture = this.state.Picture;
    newPicture.location = newPoint;
    this.setState({Picture : newPicture, displayModalAddress : false});
  }

  changePhotos(choice) {
    if (choice == "cancel")
      return;
    if (choice == "camera") {
      ImagePicker.openCamera({
        multiple: false,
        width: 200,
        height: 300,
        cropping: true,
        includeBase64 : true
      }).then(image => {
        var newPicture = Object.assign({}, this.state.Picture);
        var name = image.path.split("/");
        newPicture.photos.push({uri: image.path, source: {uri: "data:image/png;base64," + image.data}
          , dimensions: { width: 100, height: 100 }, index : newPicture.photos.length, name : name[name.length - 1], type : image.mime});
          this.setState({Picture : newPicture});
      });
    }
    else if (choice == "library") {
      ImagePicker.openPicker({
        multiple: false,
        width: 200,
        height: 300,
        cropping: true,
        includeBase64 : true
      }).then(image => {
        var newPicture = Object.assign({}, this.state.Picture);
        var name = image.path.split("/");
        newPicture.photos.push({uri: image.path, source: {uri: "data:image/png;base64," + image.data}
          , dimensions: { width: 100, height: 100 }, index : newPicture.photos.length, name : name[name.length - 1], type : image.mime});
        this.setState({Picture : newPicture});
      });
    }
  }

  deleteImage(index) {
    let newPicture = this.state.Picture;
    newPicture.photos.splice(index, 1);
    console.log("deleteImage", index);
    newPicture.photos.map((Picture, idx) => {
      Picture.index = idx;
    });
    this.setState({Picture : newPicture});
  }

  showGallery(source) {
     this.setState({displayModalGallery : true, gallerySource : {sources : this.state.Picture.photos, initialPage : source.index, deleteImage: this.deleteImage}});
  }

  render() {
    var form = null;
    var pictures = null;
    if (this.state.dataSource != null) {
      pictures = <List dataArray={this.state.dataSource._dataBlob.s1}
              renderRow={(rowData) =>
                <ListItem style={styles.listItem} key={"searchedPicture" + rowData._id}  onPress={() => this.setState({displayModal : true,
                                                Picture : {
                                                  _id : rowData._id,
                                                  title : rowData.title,
                                                  description : rowData.description,
                                                  photos : rowData.photos ? rowData.photos : []
                                                },
                                                active : rowData.active,
                                                _id : rowData._id})}>
                                                  <Thumbnail square large source={rowData.photos ? rowData.photos[0] : {uri : "https://www.pickaguide.fr/assets/images/deleted.png"}}/>
                                                            <Body>
                                                              <Text>{rowData.title}</Text>
                                                              <Text note>{rowData.description}</Text>
                                                            </Body>
                {rowData.active == true ? <IconF size={40} name="check" color="green"/> : <IconF size={40} name="times" color="red" />}
                </ListItem>
              }>
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
  if (this.state._id == -1)
    form = <Content>
      <ListItem style={styles.listItem}>
        <Button rounded light onPress={() => this.setState({displayModal : false, _id : -1, Picture : {title : "",
          description : "",
          photos : [], city : "",
          country : "", location : null}})} style={{marginTop : 5}}>
          <Icon name='arrow-back' />
        </Button>
        <Text style={{alignSelf : "center"}}>{I18n.t('Picture')['new']}</Text>
      </ListItem>
      <SignForm
        formType={7}
        form={this.state.Picture}
        value={this.state.Picture}
        onChange={this.handleChange}/>
      <Picker onValueChange={(itemValue) => this.changePhotos(itemValue)}>
          <Picker.Item label={I18n.t('Picture')['pickerLabel']} value="cancel" />
          <Picker.Item label={I18n.t('Picture')['pickerPhoto']} value="camera" />
          <Picker.Item label={I18n.t('Picture')['pickerDesktop']} value="library" />
          <Picker.Item label={I18n.t('Picture')['pickerCancel']} value="cancel" />
      </Picker>
      <PhotoGrid source={this.state.Picture.photos} onPressImage={(source) => this.showGallery(source)} />
      <ListItem style={styles.listItem, {alignSelf : "center"}}>
        <Button iconLeft transparent onPress={() => this.setState({displayModalAddress : true})}>
          <Icon name="md-flag" />
          <Text>{this.state.Picture.location ? I18n.t('Picture')['setted'] : I18n.t('Picture')['location']}</Text>
        </Button>
      </ListItem>
      <ListItem style={styles.listItem}>
        <Body>
         <Button iconLeft block primary style={{marginLeft : 5}} onPress={() => this.create()}>
           <Icon name='md-build' />
           <Text>{I18n.t('Picture')['create']}</Text>
         </Button>
        </Body>
      </ListItem>
    </Content>;
  else {
      form =  <Content>
      <ListItem style={styles.listItem}>
      <Button rounded light onPress={() => this.setState({displayModal : false, _id : -1, Picture : {title : "",
      description : "",
      photos : [], city : "",
      country : "", location : null}})} style={{marginTop : 5}}>
       <Icon name='arrow-back' />
     </Button>
     <Text style={{alignSelf : "center"}}>{I18n.t('Picture')['edit']}</Text>
     </ListItem>
     <SignForm
       formType={7}
       form={this.state.Picture}
       value={this.state.Picture}
       onChange={this.handleChange}/>
       <Picker onValueChange={(itemValue) => this.changePhotos(itemValue)}>
           <Picker.Item label={I18n.t('Picture')['pickerLabel']} value="cancel" />
           <Picker.Item label={I18n.t('Picture')['pickerPhoto']} value="camera" />
           <Picker.Item label={I18n.t('Picture')['pickerDesktop']} value="library" />
           <Picker.Item label={I18n.t('Picture')['pickerCancel']} value="cancel" />
       </Picker>

      <PhotoGrid source={this.state.Picture.photos} onPressImage={(source) => this.showGallery(source)} />

      <ListItem style={styles.listItem, {alignSelf : "center"}}>
        <Button iconLeft transparent onPress={() => this.setState({displayModalAddress : true})}>
          <Icon name="md-flag" />
          <Text>{this.state.Picture.location ? I18n.t('Picture')['setted'] : I18n.t('Picture')['location']}</Text>
        </Button>
      </ListItem>
        <ListItem style={styles.listItem}>
        <Body>
        {this.state.active == false ?
          <Button iconLeft block success style={{marginLeft : 5}} onPress={() => this.toggle()}>
            <Icon name='md-checkmark-circle' />
            <Text>{I18n.t('Picture')['enable']}</Text>
          </Button> :
          <Button iconLeft block danger style={{marginLeft : 5}} onPress={() => this.toggle()}>
            <Icon name='md-close-circle' />
            <Text>{I18n.t('Picture')['disable']}</Text>
          </Button> }
          </Body>
          </ListItem>
          <ListItem style={styles.listItem}>
          <Body>
          <Button iconLeft block primary style={{marginLeft : 5}} onPress={() => this.update()}>
            <Icon name='md-build' />
            <Text>{I18n.t('Picture')['update']}</Text>
          </Button>
          </Body>
          </ListItem>
          <ListItem style={styles.listItem}>
          <Body>
            <Button iconLeft block danger style={{marginLeft : 5}} onPress={() => this.delete()}>
              <Icon name='md-trash' />
              <Text>{I18n.t('Picture')['delete']}</Text>
            </Button>
            </Body>
            </ListItem>
        </Content>;
    }
  if (this.state.displayModal == true) {
    pictures = null;
  }
  if (this.state.displayModalAddress == true)
    return(<ChooseNewAdAddress setPicturePoint={this.setPicturePoint}/>);
  return (
      <Container>
        <Modal style={{flex : 1}} visible={this.state.displayModalGallery} hardwareAccelerated={true} onRequestClose={() => this.setState({displayModalGallery : false})} >
            <PhotosGallery data={this.state.gallerySource} hide={() => this.setState({displayModalGallery : false})}/>
        </Modal>
        <Modal style={{flex : 1}} visible={this.state.displayModal} hardwareAccelerated={true} onRequestClose={() => this.setState({displayModal : false})} >
            {form}
        </Modal>
        <Content>
        {pictures}
        </Content>
      </Container>
    );
  }
}

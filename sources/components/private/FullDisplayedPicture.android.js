import { View, TouchableHighlight, ScrollView, ListView, TextInput, StyleSheet, Modal, DatePickerAndroid, Image }   from "react-native";
import RN             from "react-native"
import React          from "react";
import Search         from "actions/Search.js";
import Styles         from 'components/styles.json';
import IconF 		      from "react-native-vector-icons/FontAwesome";
import CommentsActions from "actions/Comment.js"
import CommentsStore  from "stores/Comments.js"
import {EditComment}  from "./editcomment.js";
import SignForm       from "framework/signForm.js"
import { Container, Header, Content, List, ListItem, Left, Right, Text, Thumbnail, Body, Card, CardItem, Icon, Button } from 'native-base';
import StarRating 			from 'react-native-star-rating';
import ButtonPlus     from "framework/ButtonPlus.js"
import PhotoGrid            from 'react-native-thumbnail-grid';
import {PhotosGallery}	  	from "components/private/photosGallery.android.js";

var styles = StyleSheet.create(Styles);

export class PictureView extends React.Component{

  constructor(props, context) {
    super(props, context);


//console.log("FullDisplayPicture CONSTRUCTOR");
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {  displayModal : false,
                    displayModalGallery : false,
                    gallerySource : null,
                    _id  : this.props.navigation.state.params.data._id,
                    demand : {
                      numberVisitors : null,
                      special : null,
                      when : new Date()
                    },
                    editComment : false,
                    update  : false,
                    idComment : -1,
                    selectedComment : null,
                    ds : ds,
                    commentList  : CommentsStore.getState()["comments"].length ? ds.cloneWithRows(CommentsStore.getState()["comments"]) : null,
                    ownerId : null,
                    ownerName : "",
                    date  : "",
                    post  : "",
                    likes  : [],
                  };
    CommentsActions.get(this.state._id);
    this.sendRequest = this.sendRequest.bind(this);
    //this.openDatePicker = this.openDatePicker.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.showGallery = this.showGallery.bind(this);

 }

 componentDidMount() {
   //console.log("FullDisplayPicture MOUNTED");
   CommentsStore.listen(this.onChange);
 }

 componentWillUnmount() {
   CommentsStore.unlisten(this.onChange);
 }

 onChange(change) {
  this.setState({commentList : CommentsStore.getState()["comments"].length ? this.state.ds.cloneWithRows(CommentsStore.getState()["comments"]) : null})
 }

  /*openDatePicker() {
    DatePickerAndroid.open({
      date: this.state.when
    }).then((res) => {
      if (res.action !== DatePickerAndroid.dismissedAction) {
        this.setState({when : new Date(res.year, res.month, res.day)});
      }
    });
  }*/

  sendRequest() {
    this.setState({displayModal : false});
    Search.requestVisit(this.state._id, this.state.demand);
  }

//   updateComment(comment) {
//     // this.setState({editComment : true, update : true});
// }

  handleFormChange(field){
      this.setState({demand : field});
    }

    showGallery(source) {
      //console.log("source : ", source);
       this.setState({displayModalGallery : true, gallerySource : {sources : this.props.navigation.state.params.data.photos, initialPage : source.index}});
    }


  render(){
    console.log("FullDisplayPicture RENDER", this.props.navigation.state.params.data);
    var data = this.props.navigation.state.params.data;
    var imgImage = null;
    if (data.photos) {
      console.log('::::::::::::::::Photo LOOP:::::::::::::::');
      imgImage = <PhotoGrid source={data.photos} onPressImage={(source) => this.showGallery(source)} />
    }
    var rate = null;
    if (data.rate) {
      rate =   <StarRating
          disabled={true}
          maxStars={5}
          starSize={10}
          halfStarEnabled={true}
          starColor="#e7711b"
          rating={data.rate}/>;
    }
    if (this.state.editComment == true)
      return(<EditComment parent={this}/>);
    console.log("Render full display Picture ::: ", data);

    var comments = null;
      if (this.state.commentList != null) {
        // console.log("COMMENTSS RENDER ++++++++++++++", this.state.commentList._dataBlob.s1);
        comments =  <List dataArray={this.state.commentList._dataBlob.s1}
                  renderRow={(rowData) =>
                    <ListItem style={styles.listItem} avatar key={"commentsPicture" + rowData._id}  onPress={() => this.setState({editComment : true, update : true,
                                                    ownerName : rowData.owner.displayName,
                                                    ownerId : rowData.owner._id,
                                                    date : rowData.date,
                                                    post : rowData.post,
                                                    idComment : rowData._id,
                                                    likes : rowData.likes.length})}>
                                                    <Left>
                                          <Thumbnail source={{ uri: "https://www.pickaguide.fr/assets/images/avatar.png" }} />
                                          </Left>
                                          <Body>
                                            <Text>{rowData.post}</Text>
                                            <Text note>{rowData.owner.displayName}</Text>
                                            <Text note>{rowData.likes.length + " "}
                                            <Icon style={{fontSize : 14}} name="md-thumbs-up" />
                                            </Text>
                                          </Body>
                                          <Right>
                                            <Text note>{new Date(rowData.date).toString().split(" ").slice(0, -2).join(" ")}</Text>
                                          </Right>
                    </ListItem>
                  }>
                </List>;
      }

    return(
        <ScrollView style = {{flex : 20, marginTop: 5}}>
          <Modal style={{flex : 1}} visible={this.state.displayModalGallery} hardwareAccelerated={true} onRequestClose={() => this.setState({displayModalGallery : false})} >
              <PhotosGallery data={this.state.gallerySource} hide={() => this.setState({displayModalGallery : false})}/>
          </Modal>
          <Modal visible={this.state.displayModal} onRequestClose={() => this.setState({displayModal : false})} >
          <Content>
            <ListItem style={styles.listItem}>
            <Button rounded light onPress={() => this.setState({displayModal : false})} style={{marginTop : 5}}>
             <Icon name='arrow-back' />
           </Button>
           <Text style={{alignSelf : "center"}}>                              ASK A VISIT</Text>
           </ListItem>
           <SignForm
           formType={8}
           form={this.state.demand}
           value={this.state.demand}
           onChange={this.handleFormChange}
           />
            <ListItem style={styles.listItem}>
            <Body>
            <Button iconLeft block primary style={{marginLeft : 5}} onPress={() => this.sendRequest()}>
              <Icon name='md-send' />
              <Text>Send</Text>
            </Button>
            </Body>
            </ListItem>
          </Content>
          </Modal>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: "https://www.pickaguide.fr/assets/images/avatar.png"}} />
                <Body>
                  <Text>{data.title}</Text>
                  <Text note>{data.owner}</Text>
                  <View style={{alignSelf : "flex-start"}}>
                  {rate}
                  </View>
                </Body>
              </Left>
            </CardItem>
            <CardItem style={{marginRight : 15}}>
                {imgImage}
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  {data.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={() => this.setState({displayModal : true})} textStyle={{color: '#87838B'}}>
                  <Icon name="md-walk" />
                  <Text>  Ask for a visit !</Text>
                </Button>
              </Left>
              <Right>
                <Button transparent  onPress={() => this.setState({editComment : true})} textStyle={{color: 'green'}}>
                  <Icon name="md-add-circle" />
                  <Text>  Add a comment</Text>
                </Button>
              </Right>
            </CardItem>
        </Card>
          {comments}
        </ScrollView>
    );
 	}
}

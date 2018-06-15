import {View, ScrollView, Image, TouchableHighlight, StyleSheet, TextInput, Picker, KeyboardAvoidingView}       from "react-native";
import { Container, Input, Header, Content, List, ListItem, Left, Right, Text, Thumbnail, Body, Card, CardItem, Icon, Button } from 'native-base';
import React              from "react";
import IconF 			        from "react-native-vector-icons/FontAwesome";
import SignForm           from 'framework/signForm.js';
import ButtonSubmit       from "framework/ButtonSubmit";
import ButtonBack         from "framework/ButtonBack"
import Styles             from 'components/styles.json';
import CommentsActions    from 'actions/Comment.js';
import Comments           from 'stores/Comments.js';


var styles = StyleSheet.create(Styles);

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

export class EditComment extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.state = {
      post : null,
      // comment : this.props.parent.state.selectedComment != null ? this.props.parent.state.selectedComment : null
    }
    // if (this.props.parent.state.selectedComment != null) {
    //   this.state.comment = this.props.parent.state.selectedComment;
    // }
    this.onChange = this.onChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.toggleLike   = this.toggleLike.bind(this);
  }

  componentDidMount() {
    Comments.listen(this.onChange);
  }

  componentWillUnmount() {
    Comments.unlisten(this.onChange);
  }

  onChange(store) {
    // console.log("onChange", store.code);
      this.props.parent.setState({editComment : false, update : false, selectedComment : null, idComment : -1});
    // this.setState({code : store.code, msg : store.msg});
  }

  handleCreate() {
    var postObj = {
      post : this.state.post,
      PictureId : this.props.parent.state._id
    }
    CommentsActions.create(postObj);
    CommentsActions.get.defer(postObj.PictureId);
  }

  handleRemove() {
    var postObj = {
      id : this.props.parent.state.idComment,
      PictureId : this.props.parent.state._id
    }
    //console.log("Comment postOBJ before delete", postObj);
    CommentsActions.remove(postObj);
  }

  handleCancel() {
    this.props.parent.setState({editComment : false, update : false, selectedComment : null, idComment : -1});
  }

  toggleLike() {
    var postObj = {
      id : this.props.parent.state.idComment,
      PictureId : this.props.parent.state._id
    }
    //console.log("Comment postOBJ before delete", postObj);
    CommentsActions.toggleLike(postObj);
  }

	render() {
    //console.log("render EDIT COMMENT:", this.props.parent.state.likes);
    var display = null;
    var date = new Date(this.props.parent.state.date).toString().split(" ").slice(0, -2).join(" ");
    if (this.props.parent.state.update)
      display = <Content><ListItem style={styles.listItem}>
                          <Card>
                            <CardItem>
                                <Left>
                                  <Thumbnail source={ this.props.parent.state.photoUrl && this.props.parent.state.photoUrl != '/assets/images/avatar.png' ? { uri: "data:image/png;base64," + this.props.parent.state.photoUrl } : require("images/avatar.png")} />
                                  <Body>
                                    <Text>{this.props.parent.state.ownerName}</Text>
                                    <Text>{date}</Text>
                                  </Body>
                                </Left>
                              </CardItem>
                              <Button iconLeft transparent onPress={this.toggleLike} textStyle={{color: '#87838B'}}>
                              <Icon name="md-thumbs-up" />
                                <Text>{this.props.parent.state.likes}  Likes</Text>
                              </Button>
                              <CardItem>
                                <Body>
                                  <Text>
                                    {this.props.parent.state.post}
                                  </Text>
                                </Body>
                            </CardItem>
                          </Card>
                          </ListItem>
                          <ListItem style={styles.listItem}>
                          <Body>
                          <Button iconLeft block primary onPress={this.handleCancel}>
                            <Icon name='arrow-back' />
                            <Text>BACK</Text>
                          </Button>
                          </Body>
                          </ListItem>
                          <ListItem style={styles.listItem}>
                          <Body>
                          <Button iconRight block danger onPress={() => this.handleRemove()}>
                            <Text>Delete</Text>
                            <Icon name='md-trash' />
                          </Button>
                          </Body>
                          </ListItem>
                          </Content>;

    else
      display =   <Content><ListItem style={styles.listItem}><Input
        style         = {styles.inputBig, {paddingLeft : 5, paddingRight : 5}}
        value         = {this.state.post}
        placeholder   = {I18n.t('SignForm')['comment']}
        onChangeText  = {(value) => this.setState({post : value})} />
        </ListItem>
        <ListItem style={styles.listItem}>
        <Body>
        <Button iconLeft block primary onPress={this.handleCancel}>
          <Icon name='arrow-back' />
          <Text>BACK</Text>
        </Button>
        </Body>
        </ListItem>
        <ListItem style={styles.listItem}>
        <Body>
        <Button iconRight block success onPress={() => this.handleCreate()}>
          <Text>Send</Text>
          <Icon name='md-send' />
        </Button>
        </Body>
        </ListItem></Content>;

		return (
      <Container>
      {display}
      </Container>
		);
	}
}

import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
} from 'react-native';
import TagInput from 'react-native-tag-input';
import ProfileStore from 'stores/Profile.js';
import ProfileActions from 'actions/Profile.js'

var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

const inputProps = {
  keyboardType: 'default',
  placeholder: I18n.t('Button')['tag'],
  autoFocus: false,
  style: {
    fontSize: 20,
    marginVertical: Platform.OS == 'ios' ? 10 : -2,
  },
};

export default class TagInputInterest extends Component {
  constructor(props, context) {
    super(props, context);

  this.state = {
     tags : [],
     text : "",
   };
   this.onChange = this.onChange.bind(this);

}

componentDidMount() {
  ProfileStore.listen(this.onChange);
  if (this.props.parent && this.props.parent.interests)
    this.setState({tags : this.props.parent.interests});

}

componentWillUnmount() {
  ProfileStore.unlisten(this.onChange);
}

onChange(store) {
if (store.profile)
  this.setState({ tags : store.profile.interests});
}

   onChangeTags = (tags) => {
     this.setState({ tags });
     setTimeout(function() {
       var form = ProfileStore.getState().profile;
       form.interests = tags;
       //console.log("UpdateTags [onChangeTags] :", form.interests);
       ProfileActions.editProfile(form); }, 1);
   }

   onChangeText = (text) => {
     this.setState({ text });

     const lastTyped = text.charAt(text.length - 1);
     const parseWhen = [',', ' ', ';', '\n'];

     console.log("UpdateText:", text);

     if (parseWhen.indexOf(lastTyped) > -1) {
       this.setState({
         tags: [...this.state.tags, this.state.text],
         text: "",
       });
       var form = ProfileStore.getState().profile;
       form.interests = this.state.tags;
       form.interests = [...this.state.tags, this.state.text];
       ProfileActions.editProfile(form);
     }
   }

   labelExtractor = (tag) => tag;

   render() {
     //console.log("Tags", this.state.tags);
     return (
       <View style={{ flex: 1, margin: 10, marginTop: 20 }}>

         <Text style={{alignSelf: "center", fontSize : 18}}>{I18n.t('Button')['tagBox']}</Text>
         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray'}}>
           <TagInput
             value={this.state.tags}
             onChange={this.onChangeTags}
             labelExtractor={this.labelExtractor}
             text={this.state.text}
             onChangeText={this.onChangeText}
             tagColor="#495c70"
             tagTextColor="white"
             tagTextStyle={{fontSize : 18}}
             inputProps={inputProps}
             maxHeight={200}
           />
         </View>

       </View>
     );
   }
 }

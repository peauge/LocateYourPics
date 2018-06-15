import Gallery              from 'react-native-image-gallery';
import React, { Component } from 'react';
import { Button, Icon, Text}      from 'native-base';
import { DeviceEventEmitter, View } from 'react-native';

export class PhotosGallery extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    //title: navigation.state.params.name + "'s Profile!",
    // headerLeft:
    //   <Button rounded light onPress={this.hideGallery} style={{marginTop : 30}}>
    //     <Icon name='arrow-back' />
    //  </Button>
  });

  constructor(props, context) {
    super(props, context);
    this.state = {
      current : this.props.data.initialPage
    }
    this.delete = this.delete.bind(this);
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit("GalleryBack");
  }

  delete() {
    //console.log('index ', this.state.current);
    this.props.data.deleteImage(this.state.current);

    //setTimeout(() => {
      if (this.state.current != 0) {
        console.log("suppress +");
        this.setState({current : this.state.current - 1});
      } else if (this.props.data.sources.length > 0) {
        console.log("suppress 0");
        this.setState({current : this.state.current + 1});
      } else {
          console.log("suppress last");
          this.props.hide();
      }
    //}, 3000);
  }

  render() {

    let sources = []
    if (this.props.data.sources instanceof Array) {
      sources = this.props.data.sources;
      sources.map((source) => {
        if (!source.source) {source.source = source}
        if (!source.dimensions) {source.dimensions = { width: 100, height: 100 }}
      });
    } else {
      sources[0] = this.props.data.sources;
      if (!source.source) {source.source = source}
      if (!sources[0].dimensions) {sources[0].dimensions = { width: 100, height: 100 }}
    }
    let remove = null;
    if (this.props.data.deleteImage) {
      remove =
      <Button iconLeft block danger onPress={() => this.delete()}>
        <Icon name='md-trash' />
        <Text>DELETE</Text>
      </Button>;
    }

    return (
      <View style={{ flex: 1 }} >
        <Button rounded light onPress={() => this.props.hide()}>
         <Icon name='arrow-back' />
       </Button>
        <Gallery
          style={{ flex: 1, backgroundColor: 'black' }}
          images={sources}
          initialPage={this.props.data.initialPage}
          onPageScroll={(e) => this.setState({current : e. position})}
        >
        </Gallery>
        {remove}
      </View>
    );
  }
}

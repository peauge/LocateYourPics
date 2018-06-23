import { View, Text, StyleSheet, BackHandler, TouchableOpacity, Dimensions, Image, Platform, TouchableHighlight } from 'react-native';
import React 				             from 'react';
import MapView 						       from 'react-native-maps';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import LocationStore             from 'stores/Location.js';
import LocationActions           from 'actions/Location.js';
import reactMixin                from 'react-mixin';
import timerMixin                from 'react-timer-mixin';

const entryBorderRadius = 8;
const window = Dimensions.get('window');
export const ITEM_WIDTH = window.width * 0.9;
export const CAROUSEL_WIDTH = window.width;

const styles = StyleSheet.create({
 container: {
  //  flex : 1,
  //  justifyContent: 'space-between',
  //  flexDirection: 'column'
   ...StyleSheet.absoluteFillObject,
    //justifyContent: 'flex-end',
    //alignItems: 'center',
 },
 map: {
   //flex:3,
   ...StyleSheet.absoluteFillObject,
   //position: 'absolute',
   //top: 0,
   //left: 0,
   //right: 0,
   //bottom: 0,
    //zIndex : 0

 },
 slideInnerContainer: {
//   paddingTop: window.height * 0.5,

    backgroundColor: 'transparent',
        //flex : 1,
        width: ITEM_WIDTH,
        //height: window.viewportHeight,
        //paddingHorizontal: 5,
        paddingBottom: 18, // needed for shadow
        height: 150,
        flexDirection: 'row'
},
 caroussel: {
 },
 image: {
   //width: "10%",

   ...StyleSheet.absoluteFillObject,
   resizeMode: 'contain',
   //borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
   borderTopLeftRadius: entryBorderRadius,
   borderBottomLeftRadius : entryBorderRadius

},
radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
},

imageContainer: {
  flex: 1,
  paddingHorizontal: 0,
  marginLeft : 0,
  backgroundColor: 'transparent',
  borderTopLeftRadius: entryBorderRadius,
  borderBottomLeftRadius: entryBorderRadius,

  },
  textContainer: {
        flex : 1.5,
        //maxWidth: '65%',
        justifyContent: 'center',
        //paddingTop: 1 - entryBorderRadius,
        //paddingBottom: 1,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderTopRightRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
},

title: {
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
subtitle: {
  marginTop: 6,
  color: 'gray',
  fontSize: 12,
  fontStyle: 'italic'
},
slider: {
    marginTop: window.height * 0.5
},
sliderContentContainer: {
   backgroundColor: 'transparent',
},
paginationContainer: {
    paddingVertical: 8
},
});


export class Welcome extends React.Component{

	constructor(props, context) {
    super(props, context);
    this.state =  {
			region   : LocationStore.getState().location,
      markers : LocationStore.getState().nearPics,
      Pictures  : LocationStore.getState().nearAds
   	}
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onChange       = this.onChange.bind(this);
    this._renderCarouselItem       = this._renderCarouselItem.bind(this);
  }

  componentDidMount() {
    LocationStore.listen(this.onChange);
    this.setInterval(() =>  {LocationActions.getNearPics(0.0922); LocationActions.getNearAds(0.0122);}, 90000);
  }

  componentWillUnmount() {
    LocationStore.unlisten(this.onChange);
  }

  onChange(Location) {
    if (Location.location == this.state.region && Location.nearPics == this.state.markers)
      return;
    if (this.state.region.latitude === 0 && this.state.region.longitude === 0) {
      console.log("initial change");
      this.setState({region : Location.location, markers : Location.nearPics , Pictures : Location.nearAds});
    }
    this.setState({markers : Location.nearPics, Pictures : Location.nearAds});
  }

  onRegionChange(region) {
    this.setState({region});
  }

   onRegionChangeComplete(region) {
     this.setState({region});
   }

  _renderCarouselItem({item, index}, parallaxProps) {

    //console.log("!!!!!!!!!!!!!!!!! _renderCarouselItem !!!!!!!!!!!!!!!!", item.photoUrl);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        key={"nearPics" + item._id}
        onPress={() => this.props.navigation.navigate('Profile', {data : item})}
      >
        <View style={styles.imageContainer}>
          <ParallaxImage
            source={ item.photoUrl && item.photoUrl != "images/avatar.png" ? { uri: "data:image/png;base64," + item.photoUrl } : require("images/avatarsquare.png")}
            containerStyle={styles.imageContainer}
            style={styles.image}
            showSpinner={true}
            parallaxFactor={0.2}
             spinnerColor={'rgba(0, 0, 0, 0.25)'}
            {...parallaxProps}
          />
        </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}> {item.profile.firstName} </Text>
        <Text style={styles.subtitle}> {item.profile.description} </Text>
      </View>
      </TouchableOpacity>
    );
  }

  render(){
	  //console.log("##### Welcome rendered : ", this.state.Pictures);
    //console.log("Markers ! ", this.state.markers);
    return (
      <View  style={styles.container}>
        <MapView
      				region                = {this.state.region}
      				style                 = {styles.map}
              showsUserLocation     = {true}
              showsMyLocationButton = {true}
              onRegionChange        = {this.onRegionChange}
              onRegionChangeComplete= {this.onRegionChangeComplete}
        >
          {this.state.Pictures.map(marker => (
            <MapView.Marker coordinate={{ longitude : marker.location.coordinates[0], latitude : marker.location.coordinates[1]}} key={"Marker" + marker._id} pinColor='blue'>
              <MapView.Callout onPress={() => this.props.navigation.navigate('Picture', {data : marker})}>
                <View>
                  <Text> {marker.title} </Text>
                  <Text> {marker.description} </Text>
                  {marker.photoUrl ? <Image style={styles.imgImageList} source={{uri : marker.photoUrl}}/> : null}
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
      </View>
	  );
	}
}

// TODO : display recent pictures taken by your friends
// <Carousel
//   style             = {styles.carousel}
//   ref               = {(c) => { this._carousel = c; }}
//   data              = {this.state.markers}
//   renderItem        = {this._renderCarouselItem}
//   hasParallaxImages = {true}
//   sliderWidth       = {CAROUSEL_WIDTH}
//   sliderHeight       = {15}
//   itemWidth         = {ITEM_WIDTH}
//   itemHeight         = {15}
//   inactiveSlideScale          = {0.8}
//   inactiveSlideOpacity        = {0.7}
//   enableMomentum              = {false}
//   containerCustomStyle={styles.slider}
//   contentContainerCustomStyle={styles.sliderContentContainer}
// />

reactMixin(Welcome.prototype, timerMixin);

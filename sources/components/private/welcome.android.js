import { View, Text, StyleSheet, BackHandler, TouchableOpacity, Dimensions, Image, Platform, TouchableHighlight } from 'react-native';
import React 				             from 'react';
import MapView 						       from 'react-native-maps';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import LocationStore             from 'stores/Location.js';
import PicturesStore             from 'stores/Pictures.js';
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
      Pictures  : PicturesStore.getState().Pictures
   	}
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onChange       = this.onChange.bind(this);
  }

  componentDidMount() {
    LocationStore.listen(this.onChange);
    PicturesStore.listen(this.onChange);
  }

  componentWillUnmount() {
    LocationStore.unlisten(this.onChange);
    PicturesStore.unlisten(this.onChange);
  }

  onChange(Location) {
    this.setState({markers : Location.nearPics, Pictures : PicturesStore.getState().Pictures});
  }

  onRegionChange(region) {
    this.setState({region});
  }

   onRegionChangeComplete(region) {
     this.setState({region});
   }

  render(){
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
          {this.state.Pictures.map((marker, index) => (
            <MapView.Marker coordinate={{ longitude : marker[index].longitude ? marker[index].longitude : 2, latitude : marker[index].latitude ? marker[index].latitude : 48}} key={"Marker" + marker[index].id} pinColor='red'>
              <MapView.Callout style={{ flex: 1, position: 'absolute', width:200, height:200}}>
                <View>
                  { marker[index].url ? <Image style={{height : 200, width : 200}} source={{uri : marker[index].url}}/> : null}
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
      </View>
	  );
	}
}

reactMixin(Welcome.prototype, timerMixin);

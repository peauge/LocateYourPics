import { View, Text, StyleSheet, BackHandler } from 'react-native';
import React 				      from 'react';
import MapView 						from 'react-native-maps';
import LocationStore      from 'stores/Location.js';
import LocationActions    from 'actions/Location.js';
import reactMixin         from 'react-mixin';
import timerMixin         from 'react-timer-mixin';

const styles = StyleSheet.create({
 container: {
   flex : 1,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
   position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

 },
});

export class ChooseNewAdAddress extends React.Component{

	constructor(props, context) {
    super(props, context);

    this.state =  {
			region   : LocationStore.getState().location,
      location : []
   	}
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onChange       = this.onChange.bind(this);
    this.onPress        = this.onPress.bind(this);
  }

  onChange(Location) {
    if (Location.location == this.state.region && Location.nearPics == this.state.markers)
      return;
    if (this.state.region.latitude === 0 && this.state.region.longitude === 0) {
      console.log("initial change");
      this.setState({region : Location.location, markers : Location.nearPics});
    }
    this.setState({markers : Location.nearPics});
  }

  onRegionChange(region) {
    this.setState({region});
  }

  onRegionChangeComplete(region) {
   this.setState({region});
  }

  onPress(event) {
    this.setState({location : [event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude]})
    this.props.setPicturePoint(this.state.location);
  }

  render(){
    var marker;
    if (this.state.location.length != 0) {
      marker =  <MapView.Marker coordinate={{latitude : this.state.location[0], longitude : this.state.location[1]}} title='Meeting point'/>
    }

    return (
			<MapView
				region                = {this.state.region}
				style                 = {styles.container}
        showsUserLocation     = {true}
        showsMyLocationButton = {true}
        onRegionChange        = {this.onRegionChange}
        onRegionChangeComplete= {this.onRegionChangeComplete}
        onPress={ (event) => this.onPress(event) }
      >
      {marker}
    </MapView>
		);
	}
}

//reactMixin(Welcome.prototype, timerMixin);

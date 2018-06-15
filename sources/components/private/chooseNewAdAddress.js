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
      //location : LocationStore.getState().nearGuides.location,

			region   : LocationStore.getState().location,
      location : []
      //LocationStore.getState().location,
      /*markers  : LocationStore.getState().nearGuides,/*[{
          latlng : {
            latitude: 51.292804,
  			    longitude: 1.061884
          },
          lastName : "Pradelles",
          firstName : "Vivien",
          description : "Visite posay à Canterbury",
          interests : "Visites",
          photoUrl : ""
        },
        {
          latlng : {
            latitude: 51.297804,
            longitude: 1.061884
          },
          lastName : "Sangoi",
          firstName : "Lucas",
          description : "Tour des boites de nuit",
          interests : "Soirées, pubs",
          photoUrl : ""
        }
      ]*/
   	}
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onChange       = this.onChange.bind(this);
    this.onPress        = this.onPress.bind(this);
  }

  // componentDidMount() {
  //   this.setInterval(() =>  {LocationActions.getNearGuides(0.0922)}, 10000);
  //   LocationStore.listen(this.onChange);
  // }

  // componentWillUnmount() {
  //   console.log(" Welcome unmount !!");
  //   //if (this.props.screenProps)
  //     //this.props.screenProps.setState({regionSaved : this.state.region});
  //   LocationStore.unlisten(this.onChange);
  // }

  onChange(Location) {
    //console.log("On location change : ", Location.location.latitude);
    if (Location.location == this.state.region && Location.nearGuides == this.state.markers)
      return;
    if (this.state.region.latitude === 0 && this.state.region.longitude === 0) {
      console.log("initial change");
      this.setState({region : Location.location, markers : Location.nearGuides});
    }
    //console.log("SET NEW MARKER: ", Location.nearGuides);
    this.setState({markers : Location.nearGuides});
  }

  onRegionChange(region) {
    //console.log("region changed", region);
    this.setState({region});
  }

  onRegionChangeComplete(region) {
   //console.log("region change complete", region);
   this.setState({region});
  }

  onPress(event) {
    //console.log("tutu : ", event.nativeEvent.coordinate)
    this.setState({location : [event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude]})
    this.props.updateMeetingPoint(this.state.location);
  }

  render(){
	  //console.log("##### ChooseNewAdAddress rendered : ");
    //console.log("Markers ! ", this.state.location);
    var marker;
    if (this.state.location.length != 0) {
      //console.log("hey ! ", this.state.location);
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

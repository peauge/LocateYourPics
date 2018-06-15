'use strict';
import React                from "react";
import {AppRegistry} 			  from 'react-native';
import {PublicWelcomePage}  from "components/public/publicWelcomePage.android.js";
import {PrivateWelcomePage} from "components/private/privateWelcomePage.android.js";
import {StackNavigator, TabNavigator}     from 'react-navigation';
import LocationActions	    from 'actions/Location.js';
import {Search}			  	    from "components/private/search.android.js";
//import {PhotosGallery}	  	    from "components/private/photosGallery.android.js";
import hoist							  from 'hoist-non-react-statics';


navigator.geolocation.getCurrentPosition(
  (position) => {
  //  console.log("!! GetPosition !!", position);
    LocationActions.sendLocation(position.coords);
  },(err) => {
  //  console.log('ERROR(' + err.code + '): ' + err.message);
  }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
);

export const AppNavigator = StackNavigator({
  Unconnected: {
    screen: PublicWelcomePage,
    navigationOptions: {header : null}
  },
  Connected: {
    screen: PrivateWelcomePage,
    navigationOptions: {header : null}
  },
  Search: {
    screen: Search
  },
},{
  stateName: 'MainAppNav'
});

//AppRegistry.registerHeadlessTask("sendLocation", require('backgroundJobs/geolocation.js'));
AppRegistry.registerComponent('pickaguide', () => AppNavigator);
//AppRegistry.runApplication('pickaguide', null);

import LocationActions  from 'actions/Location.js';
import AccountStore     from 'stores/Account.js'

module.exports = () => {
  //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Geoloc!!!!!!!!!!!!!!!!!!!!!!!");
  var id = navigator.geolocation.watchPosition(
    (position) => {
      //console.log("# Salut !!!!!!");
      //console.log("!! WatchPosition !! ", AccountStore.getState().account, " id : ", id);
      if (AccountStore.getState().account == null)
        navigator.geolocation.clearWatch(id);
      LocationActions.sendLocation(position.coords);
    }, (err) => {
      console.log('ERROR(' + err.code + '): ' + err.message);
    }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
  );
  return id;
}

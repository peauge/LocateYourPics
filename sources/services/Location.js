import PromiseApi      from './promiseApi.js';
import LocationActions from 'actions/Location.js';
import AvatarApi       from 'services/Avatar.js';

export default class LocationApi {

  static sendLocation(coords) {
    //console.log("Location service", coords.latitude, " && ", coords.longitude);
    PromiseApi.post('/profiles/geo', { lat : coords.latitude, lng : coords.longitude })
    .then((result) => {
      console.log(result);

        if (result.error) {
          console.log("Location service error");
          LocationActions.sendLocationError(result);
          return;
        }
        result.geo = {
          longitude : result.geo[0],
          latitude : result.geo[1],
          latitudeDelta		: 0.0922,
          longitudeDelta	: 0.0421
        };
        LocationActions.sendLocationSuccess(result);
    })
    .catch((err) => {
      console.log("Location service catch ", err);
        LocationActions.sendLocationError(err);
    });
  }

  static nearPhotos(range) {
    PromiseApi.get('/proposals/geo/')
    .then((result) => {
        if (result.error) {
          console.log("getNearPhotos service error");
          LocationActions.getNearPhotosError(result);
          return;
        }
        LocationActions.getNearPhotosSuccess(result);
    })
    .catch((err) => {
      console.log("getNearPhotos catch ", err);
        LocationActions.getNearAdsError(err);
    });
  }
}

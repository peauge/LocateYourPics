import PromiseApi      from './promiseApi.js';
import LocationActions from 'actions/Location.js';
import AvatarApi       from 'services/Avatar.js';

export default class LocationApi {

  static sendLocation(coords) {
    //console.log("Location service", coords.latitude, " && ", coords.longitude);
    PromiseApi.auth().post('/profiles/geo', { lat : coords.latitude, lng : coords.longitude })
    .then((result) => {
      console.log("###################### Location service process : ########################");
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

  static getNearGuides(range) {
    //console.log("getNearGuides service");
    PromiseApi.auth().get('/profiles/geo/' + 100000)
    .then((result) => {

      //console.log("Location service process : ", result);

        if (result.error) {
          console.log("getNearGuides service error");
          LocationActions.getNearGuidesError(result);
          return;
        }
        let ids = [];
        result.map((guide) => {
          ids.push(guide._id)
        });
        AvatarApi.getAvatars(ids, [])
          .then(avatars => {
            // console.log("~~~~~~~~~~~ avatars preview ~~~~~~~~~~~~~~~")
            // console.log(avatars);
            // console.log("~~~~~~~~~~~ 0 ~~~~~~~~~~~~~~~")
            // console.log(avatars[0]);
            // console.log("~~~~~~~~~~~ 1 ~~~~~~~~~~~~~~~")
            // console.log(avatars[1]);
            result.map((guide, idx) => {
              guide.photoUrl = avatars[idx];
            });
            // console.log("~~~~~~~~~~~ avatars ~~~~~~~~~~~~~~~")
            // console.log(result)
            LocationActions.getNearGuidesSuccess(result);
          });

          //   CommentAvatarsActions.getSuccess.defer(
          //   ids.map((id, index) => {
          //     return { id, avatar: avatars[index] };
          //   })
          // ))
          // //.catch(err => CommentAvatarsActions.error(err));
    })
    .catch((err) => {
      // console.log("getNearGuides catch ", err);
        LocationActions.getNearGuidesError(err);
    });
  }

  static nearAds(range) {

    PromiseApi.auth().get('/proposals/geo/' + 100000)
    .then((result) => {
      //console.log("Location adsssssssssss service process : ", result);

        if (result.error) {
          console.log("getNearAds service error");

          LocationActions.getNearAdsError(result);
          return;
        }

        LocationActions.getNearAdsSuccess(result);
    })
    .catch((err) => {
      console.log("getNearAds catch ", err);
        LocationActions.getNearAdsError(err);
    });
  }
}

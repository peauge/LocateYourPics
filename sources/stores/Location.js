import alt             from '../alt';
import LocationActions from 'actions/Location.js';
import LocationApi     from 'services/Location.js';
import PictureActions   from 'actions/Pictures.js';
import PictureApi       from 'services/Picture.js';
import ErrorAlert      from 'framework/ErrorAlert.js'

class LocationStore {
    constructor() {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      this.errorAlert = new ErrorAlert();
        this.location = {
          latitude				: 0,
          longitude				: 0,
          latitudeDelta		: 0.0922,
          longitudeDelta	: 0.0421
        };
        this.nearPics = [];
        this.nearAds = [];

        this.bindActions(LocationActions);
        this.bindActions(PictureActions);
    }

    onSendLocation(coords) {
        //console.log('onSendLocation : ', coords);
        // LocationApi.sendLocation(coords);
        console.log("SENDLOC HERE", coords, this.location);
        this.location.longitude = coords.longitude;
        this.location.latitude = coords.latitude;

        // this.location.latitude = coords[1];

        return false;
    }

    onSendLocationSuccess(res) {
      //console.log('Location success, ', res);
      this.location = res.geo;
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
    }

    onSendLocationError(error) {
        console.log('Return : ', error);
        this.error.msg = error;
        this.error.origin = "Send Location Error";
        this.errorAlert.checkError(this.error);
    }

    ongetNearPics(range) {
      //console.log("{{{{{{{{{{{{{{{{{ ongetNearPics !!!!!!!!!!!!!!!!!!!!!!");
      LocationApi.getNearPics(range);
      return false;
    }

    ongetNearPicsSuccess(res) {
      console.log("ongetNearPicsSuccess");
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      this.nearPics = res;
      //this.Pictures = res.Pictures;
      //console.log('ongetNearPics success', res);
    }

    ongetNearPicsError(error) {
      console.log("ongetNearPicsError");
      this.error.msg = error;
      this.error.origin = "Get Near Guides Error";
      this.errorAlert.checkError(this.error);
    }

    onGetNearAds(range) {
      console.log("onGetNearAds !!!!!!!!!!!!!!!!!!!!!!");
      LocationApi.nearAds(range);
      return false;
    }

    onGetNearAdsSuccess(res) {
      //console.log("onGetNearAdsSuccess : ", res);
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
        this.nearAds = res
        this.nearAds.map((Picture) => {
          PictureApi.findPictures(Picture._id);
        })
        //this.Pictures = res.Pictures;
        //console.log('ongetNearPics success', res);
    }

    onGetNearAdsError(error) {
      this.error.msg = error;
      this.error.origin = "Get Near Ad Error";
      this.errorAlert.checkError(this.error);
    }

    onPicturePictureSuccess(res) {
      //console.log("Location onPicturePictureSuccess : ", res, " /*/");
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      let ct = 0;
      for (Picture of this.nearAds) {
        if (Picture._id == res[0]) {
          //console.log("!!!!!!!! trouvée !!!!!!");
          //console.log(Picture.title);
          Picture.photos = res[1];
          //console.log(Picture.photos, res[1]);
          break ;
        }
      ct++;
      }
      //console.log("LocationAfter : ", this.nearAds[ct], " /*/");
    }

    onPicturePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Location Picture Picture Error";
        this.errorAlert.checkError(this.error);
    }
}

export default alt.createStore(LocationStore, 'LocationStore');

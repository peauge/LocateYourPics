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
        this.nearGuides = [];
        this.nearAds = [];

        this.bindActions(LocationActions);
        this.bindActions(PictureActions);
    }

    onSendLocation(coords) {
        //console.log('onSendLocation : ', coords);
        LocationApi.sendLocation(coords);
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

    onGetNearGuides(range) {
      //console.log("{{{{{{{{{{{{{{{{{ onGetNearGuides !!!!!!!!!!!!!!!!!!!!!!");
      LocationApi.getNearGuides(range);
      return false;
    }

    onGetNearGuidesSuccess(res) {
      console.log("onGetNearGuidesSuccess");
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      this.nearGuides = res;
      //this.Pictures = res.Pictures;
      //console.log('onGetNearGuides success', res);
    }

    onGetNearGuidesError(error) {
      console.log("onGetNearGuidesError");
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
        //console.log('onGetNearGuides success', res);
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

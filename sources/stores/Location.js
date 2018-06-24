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

        this.location.longitude = coords.longitude;
        this.location.latitude = coords.latitude;

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
  }


export default alt.createStore(LocationStore, 'LocationStore');

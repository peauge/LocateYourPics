import alt            from '../alt';
import PictureActions  from 'actions/Pictures.js';
import SearchApi      from 'services/Search.js';
import PictureApi      from 'services/Picture.js';
import ErrorAlert     from 'framework/ErrorAlert.js'

class PicturesStore {
    constructor() {
        this.Pictures = [];
        this.guidePictures = [];
        this.alert = false;
        this.error = {
          msg: "",
          origin: "",
          code: ""
        };
        this.form = null;
        this.errorAlert = new ErrorAlert();
        this.bindActions(PictureActions);
    }

    onGetMyPictures(id) {
        PictureApi.getMyPictures(id);
        return false;
    }

    onGetMyPicturesSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      this.Pictures.push(res);
      console.log("onGetGuidePicturesSuccess", res, this.Pictures);
    }

    onGetMyPicturesError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
    }

    onCreatePicture(image, longitude, latitude, userId) {
      PictureApi.createPicture(image, longitude, latitude, userId);
      return false;
    }

    onCreatePictureSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      PictureApi.getMyPictures();
    }

    onCreatePictureError(error) {
        if (error == "Invalid data")
          this.error.msg = "All the fields are required";
        else
          this.error.msg = error;
        this.error.origin = "Picture error";
        console.log("onCreatePictureError", this.error.msg);
        this.errorAlert.checkError(this.error);
    }

    onUpdatePicture(form) {
      PictureApi.updatePicture(form);
      return false;
    }

    onUpdatePictureSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      PictureApi.getMyPictures();
    }

    onUpdatePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
    }

    onDeletePicture(id) {
      PictureApi.deletePicture(id);
      return false;
    }

    onDeletePictureSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      PictureApi.getMyPictures();
    }

    onDeletePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
    }

    onTogglePicture(form) {
       PictureApi.togglePicture(form.id);
       return false;
    }

    onTogglePictureSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      }
     PictureApi.getMyPictures();
    }

    onTogglePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
    }

    onPicturePictureSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      }
    }

    onPicturePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture Picture Error";
        this.errorAlert.checkError(this.error);
    }
}

export default alt.createStore(PicturesStore, 'PicturesStore');

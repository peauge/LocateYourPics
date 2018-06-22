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

    onGetMyPictures() {
        PictureApi.getMyPictures();
        return false;
    }

    onGetMyPicturesSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      this.Pictures = res.Pictures;
      console.log("onGetGuidePicturesSuccess");
      this.Pictures.map((Picture) => {
        PictureApi.findPictures(Picture._id);
      })
    }

    onGetMyPicturesError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
    }

    onGetGuidePictures(id) {
        PictureApi.getGuidePictures(id);
        return false;
    }

    onGetGuidePicturesSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };

      this.guidePictures = res.Pictures;
      console.log("onGetGuidePicturesSuccess");
      this.guidePictures.map((Picture) => {
        PictureApi.findPictures(Picture._id);
      })
    }

    onGetGuidePicturesError(error) {
        this.error.msg = error;
        this.error.origin = "Picture error";
        this.errorAlert.checkError(this.error);
        this.guidePictures = [];
    }

    onCreatePicture(form) {
      this.form = form;
      PictureApi.createPicture(form);
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
      //console.log("onPicturePictureSuccess : ", res, " /*/");
      this.error = {
        msg: "",
        origin: "",
        code: ""
      }
        //console.log("Pictures : ", this.Pictures);
          // for (Picture of this.Pictures) {
          //   if (Picture._id == res[0] && res[1]) {
          //     res[1].map((photo, idx) => {
          //       res[1][idx] = {uri: photo.uri, source: {uri: photo.uri}
          //         , dimensions: { width: 100, height: 100 }, index : idx, name : "image" + idx + ".jpg"};
          //       });
          //     Picture.photos = res[1];
          //     break ;
          //   }
          // }
          // for (Picture of this.guidePictures) {
          //   if (Picture._id == res[0]) {
          //     Picture.photos = res[1];
          //     break ;
          //   }
          // }
    }

    onPicturePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture Picture Error";
        this.errorAlert.checkError(this.error);
    }
}

export default alt.createStore(PicturesStore, 'PicturesStore');
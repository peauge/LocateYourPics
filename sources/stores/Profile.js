import alt            from '../alt';
import ProfileActions from 'actions/Profile.js';
import ProfileApi     from 'services/Profile.js';
import ErrorAlert         from 'framework/ErrorAlert.js'

// import AccountActions from 'store/Account.js'

class ProfileStore {

    constructor() {
        this.tmpProfile = null;
        this.profile = null;
        this.otherProfile = null;
        this.res = {
          code : '',
          message  : '',
          origin   : '',
        };
        this.guide = false;
        this.alert = null;
        this.code = null;
        this.msg  = null;
        this.origin = null;
        this.away = false;
        this.errorAlert = new ErrorAlert();

        this.bindActions(ProfileActions);
    }

    onGetMyProfile(id) {
        ProfileApi.getMyProfile(id);
        ProfileApi.getAvatar(id);
        return false;
    }

    onGetMyProfileSuccess(result) {
        //console.log('getMyProfileSuccess', result);
        this.profile = result;
        this.code = 200;
        this.msg = result.message;
    }

    onGetMyProfileError(result) {
        this.code = result.code;
        this.msg = result;
        this.origin = "Profile error"
        this.errorAlert.checkError(this);
    }

    onGetAvatarSuccess(result) {
      if (this.profile !== null)
          this.profile.photo = result;
        this.code = 200;
        this.msg = result.message;
    }

    onGetAvatarError(result) {
        this.code = result.code;
        this.msg = result;
        this.origin = "Avatar error"
        this.errorAlert.checkError(this);
    }

    onGetProfile(id) {
        ProfileApi.getProfile(id);
        return false;
    }

    onGetProfileSuccess(result) {
        this.otherProfile = result;
        this.code = 200;
        this.msg = result.message;
    }

    onGetProfileError(result) {
        this.code = result.code;
        this.msg = result;
        this.origin = "Profile error"
        this.errorAlert.checkError(this);
    }

    onEditProfile(form) {
        this.alert = false;
        this.tmpProfile = form;
        ProfileApi.editProfile(form);
        if (this.profile && form.photo != this.profile.photo) {
          console.log("New photo sent !!");
          ProfileApi.editPhoto(form.photo);
        }
        return false;
    }

    onEditProfileSuccess(result) {
      // console.log("onEditProfileSuccess", result);
        this.code = 200;
        this.msg = result.message;
        this.profile = this.tmpProfile;
        if (this.profile && this.profile.photo && this.profile.photo.data)
          this.profile.photo = this.profile.photo.data;
        this.tmpProfile = null;
    }

    onEditProfileError(result) {
        //console.log("onEditProfileError", result);
        // this.code = result.code;
        this.msg = result;
        this.origin = "Edit profile error"
        this.errorAlert.checkError(this);
        this.tmpProfile = null;
    }

    onEditPhotoSuccess(result) {
        this.code = 200;
        this.msg = result.message;
        //ProfileApi.getAvatar(this.profile._id);
        //this.profile.photoUrl = result.photoUrl;
        //this.profile.photo = result.photoUrl;
    }

    onEditPhotoError(result) {
        // this.code = result.code;
        // this.msg = result.message;
        this.msg = result;
        this.origin = "Edit photo error"
        this.errorAlert.checkError(this);
    }

    onBecomeGuide(profile) {
        ProfileApi.becomeGuide(profile);
    }

    onBecomeGuideError(result) {
      // this.code = result.code;
      this.msg = result;
      this.origin = "Become guide error"
      this.errorAlert.checkError(this);
    }

    onBecomeGuideSuccess(result) {
      this.code = 200;
      this.msg = result.message;
      this.guide = true;
    }

    onRetire() {
      ProfileApi.retire();
    }

    onRetireSuccess(result) {
      this.code = 200;
      this.msg = result.message;
      this.guide = false;
    }

    onRetireError() {
      this.msg = result;
      this.origin = "Retire error"
      this.errorAlert.checkError(this);
    }

    onUpdateAway(bool) {
      this.away = bool;
    }

    onAlertGuideDismiss() {
      this.alert = false;
    }
}

export default alt.createStore(ProfileStore, 'ProfileStore');

import PromiseApi     from './promiseApi.js';
import ProfileActions from 'actions/Profile.js';

export default class ProfileApi {

  static getMyProfile(id) {
    PromiseApi.get('/api/users/' + id)
    .then((result) => {
      if (result.error) {
        ProfileActions.getMyProfileError(result);
        return;
      }

      ProfileActions.getMyProfileSuccess(result);
    })
    .catch((err) => {
      ProfileActions.getMyProfileError(err);
    });
  }

  static getProfile(id) {
    PromiseApi.get('/api/users/' + id)
    .then((result) => {
      if (result.error) {
        ProfileActions.getProfileError(result);
        return;
      }
      result._id = id;
      ProfileActions.getProfileSuccess(result);
    })
    .catch((err) => {
      ProfileActions.getProfileError(err);
    });
  }

  static editProfile(form) {
    PromiseApi.put('/profiles', form)
    .then((result) => {
      if (result.error) {
        ProfileActions.editProfileError(result);
        return;
      }
      ProfileActions.editProfileSuccess(result);

    })
    .catch((err) => {
      ProfileActions.editProfileError(err);
    });
  }

  static editPhoto(photo) {
    const fileUpload = new FormData();
    var name = photo.path.split("/");
    fileUpload.append('avatar', {uri: photo.path, name : name[name.length - 1], type : photo.mime});

    PromiseApi.upload(`/api/users/${id}/avatar`, fileUpload)
    .then((result) => {
      if (result.error) {
        ProfileActions.editPhotoError(result);
        return;
      }
      ProfileActions.editPhotoSuccess(result);
    })
    .catch((err) => {
      console.log("editPhoto catch !!", err);
      ProfileActions.editPhotoError(err);
    });
  }

  static getAvatar(id) {
    //console.log("getAvatar service");
    PromiseApi.download('/api/users/' + id + '/avatar')
    .then((result) => {
      if (result.error) {
        console.log("getAvatar error !!", err);
        ProfileActions.getAvatarError(result);
        return;
      }
      ProfileActions.getAvatarSuccess(result);
    })
    .catch((err) => {
      console.log("getAvatar catch !!", err);
      ProfileActions.getAvatarError(err);
    });
  }
}

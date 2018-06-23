import PromiseApi     from './promiseApi.js';
import ProfileActions from 'actions/Profile.js';

export default class ProfileApi {

  static getMyProfile(id) {
      PromiseApi.auth().get('/profiles/' + id)
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
        PromiseApi.auth().get('/public/profiles/' + id)
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
      //  photo, name[name.length - 1], 'avatar');
      //console.log("editPhoto service", fileUpload);
      //var file = {name : name[name.length - 1], file : fileUpload};
      //var file = new File([photo.data], name[name.length - 1], {type:"jpeg"});
      //console.log("File : ", file);
      //fileUpload.append("avatar", file, file.name, 'avatar');
      PromiseApi.upload(`/users/${id}/avatar`, fileUpload)
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
      PromiseApi.download('/public/profiles/' + id + '/avatar')
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
}

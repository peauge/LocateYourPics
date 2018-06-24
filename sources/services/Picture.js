import PromiseApi     from './promiseApi.js';
import PictureActions  from 'actions/Pictures.js';
import SearchActions  from 'actions/Search.js';

export default class PictureApi {

  static getMyPictures(id = "1") {
    console.log("GETMYPIC", id);
    PromiseApi.get("/api/users/" + id + "/photos")
    .then((result) => {

        if (result.error) {
          PictureActions.getMyPicturesError(result);
          return;
        }
        PictureActions.getMyPicturesSuccess(result);
    })
    .catch((err) => {
        PictureActions.getMyPicturesError(err);
    });
  }

  static getFriendsPictures(id) {

  }

  static findMainPicture(PictureId) {
    console.log("findPictures");
    PromiseApi.get(`/public/proposals/${PictureId}/imageHooks`)
      .then((hooks) => {
        Promise.all(hooks.map(hook => PromiseApi.download(`/public/proposals/${PictureId}/image/${hook}`)))
          .then((photos) => {
            photos.map((photo, idx) => {
              console.log("################ Photo ", idx);
              photo = {uri: "data:image/png;base64," + photo, source: {uri: "data:image/png;base64," + photo}
                , dimensions: { width: 100, height: 100 }, index : idx};
            });
            PictureActions.PicturePictureSuccess([PictureId, photos]);
          });
      })
  }

  static findPictures(PictureId) {
    console.log("findPictures");
    PromiseApi.get(`/public/proposals/${PictureId}/imageHooks`)
      .then((hooks) => {
        Promise.all(hooks.map(hook => PromiseApi.download(`/public/proposals/${PictureId}/image/${hook}`)))
          .then((photos) => {
            photos.map((photo, idx) => {
              photos[idx] = {uri : "data:image/png;base64," + photo};
            });
            PictureActions.PicturePictureSuccess([PictureId, photos]);
          });
      })
       .catch((err) => {
        console.log(err);
     });
  }

  static createPicture(form, location, user) {
    const files = form.photos;
    delete form.photos;
    console.log("Picture Create service !!!", JSON.stringify(location));

    PromiseApi.post('/api/photos', {userId : user, base64 : files, longitude : location.longitude, latitude : location.latitude})
    .then((result) => {
      console.log("createPicture service process");

        if (result.error) {
          console.log("!! createPicture service error !!!!");
          PictureActions.createPictureError(result);
          return;
        }
        console.log("!! createPicture service Success !!!!");
        PictureActions.createPictureSuccess(result);
    })
    .catch((err) => {
      console.log("ERROR Picture CREATION service catch ", err);
      PictureActions.createPictureError(err);
    });
  }

  static updatePicture(form) {
    const files = form.photos;
    delete form.photos;

    PromiseApi.uploads(`/proposals/${form._id}`, form, files, 'PUT')
    .then((result) => {
      console.log("updatePicture service process");

        if (result.error) {
          console.log("updatePicture service error");
          PictureActions.updatePictureError(result);
          return;
        }
        PictureActions.updatePictureSuccess(result);
    })
    .catch((err) => {
        console.log("ERROR Picture UPDATE  service catch ", err);
        PictureActions.updatePictureError(err);
    });
  }

  static deletePicture(id) {
    PromiseApi.delete('/proposals/' + id)
    .then((result) => {
        if (result.error) {
          PictureActions.deletePictureError(result);
          return;
        }
        PictureActions.deletePictureSuccess(result);
    })
    .catch((err) => {
        PictureActions.deletePictureError(err);
    });
  }

  static togglePicture(id) {
      PromiseApi.put('/proposals/' + id + '/toggle')
        .then((res) => {
          if (res.error) {
            PictureActions.togglePictureError(res.error);
          } else {
            PictureActions.togglePictureSuccess(res.Pictures);
          }
        })
        .catch((err) => {
          PictureActions.togglePictureError(err);
        });
    }
}

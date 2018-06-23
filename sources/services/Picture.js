import PromiseApi     from './promiseApi.js';
import PictureActions  from 'actions/Pictures.js';
import SearchActions  from 'actions/Search.js';

export default class PictureApi {

  static getMyPictures(id = "1") {
    //console.log("get Picture service");
    PromiseApi.get("/api/users/" + id + "/photos")
    // PromiseApi.auth().get('/proposals')
    .then((result) => {

        if (result.error) {
          //console.log("get Picture service error");
          PictureActions.getMyPicturesError(result);
          return;
        }
        PictureActions.getMyPicturesSuccess(result);
    })
    .catch((err) => {
      //console.log("get Picture service catch ", err);
        PictureActions.getMyPicturesError(err);
    });
  }

  static getFriendsPictures(id) {
    //console.log("get guides Picture service");
    PromiseApi.get('/public/users/' + id + '/proposals')
    .then((result) => {
      //console.log("requestVisit service process");

        if (result.error) {
          //console.log("get guides Picture error");
          PictureActions.getGuidePicturesError(result);
          return;
        }
        PictureActions.getGuidePicturesSuccess(result);
    })
    .catch((err) => {
      //console.log("get guides Picture catch ", err);
        PictureActions.getGuidePicturesError(err);
    });
  }

  static findMainPicture(PictureId) {
    console.log("findPictures");
    PromiseApi.get(`/public/proposals/${PictureId}/imageHooks`)
      .then((hooks) => {
        //console.log("Hooks", hooks);
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
      // .catch((err) => {
      //   PictureActions.PicturePictureError(err);
      // });
  }

  static findPictures(PictureId) {
    console.log("findPictures");
    PromiseApi.get(`/public/proposals/${PictureId}/imageHooks`)
      .then((hooks) => {
        //console.log("-----------Hooks-------------", hooks);
        Promise.all(hooks.map(hook => PromiseApi.download(`/public/proposals/${PictureId}/image/${hook}`)))
          .then((photos) => {
            photos.map((photo, idx) => {
              photos[idx] = {uri : "data:image/png;base64," + photo};
            });
            PictureActions.PicturePictureSuccess([PictureId, photos]);
          });
      })
       .catch((err) => {
         //PictureActions.PicturePictureError(err);
     });
  }

  static createPicture(form, location, user) {
    console.log("Picture Create service !!!", form, location, user);
    const files = form.photos;
    delete form.photos;

      //const fileUpload = new FileReader();
      //var name = file.path.split("/");
      //fileUpload.append('avatar', {uri: file.path, name : name[name.length - 1], type : file.mime});
    PromiseApi.auth().uploads('/proposals', form, files)
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

    PromiseApi.auth().uploads(`/proposals/${form._id}`, form, files, 'PUT')
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

  // static update(form) {
  //   const files = form.photos;
  //   delete form.photos;
  //
  //   let promiseChain = null;
  //
  //   if (files.length > 0) {
  //     promiseChain = PromiseApi.auth().uploads(`/proposals/${form._id}`, form, files, 'PUT');
  //   } else {
  //     promiseChain = PromiseApi.auth().put(`/proposals/${form._id}`, { proposalForm: form });
  //   }
  //
  //   promiseChain
  //     .then((res) => {
  //       if (res.error) {
  //         PicturesActions.error(res.error);
  //       } else {
  //         if (res.Picture.photoUrl === '') {
  //           PromiseApi.download(`/public/proposals/${form._id}/image`)
  //           .then((image) => {
  //             res.Picture.images = [image];
  //             PicturesActions.updateSuccess.defer(res.Picture);
  //           });
  //         } else {
  //           res.Picture.images = [res.Picture.photoUrl];
  //           PicturesActions.updateSuccess.defer(res.Picture);
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       PicturesActions.error(err);
  //     });
  // }

  static deletePicture(id) {
    PromiseApi.auth().delete('/proposals/' + id)
    .then((result) => {
      //console.log("deletePicture service process");

        if (result.error) {
          //console.log("deletePicture service error");
          PictureActions.deletePictureError(result);
          return;
        }
        PictureActions.deletePictureSuccess(result);
    })
    .catch((err) => {
      //console.log("requestVisit service catch ", err);
        PictureActions.deletePictureError(err);
    });
  }

  static togglePicture(id) {
    //console.log("TOGGLE Start catch ", id);
      PromiseApi.auth().put('/proposals/' + id + '/toggle')
        .then((res) => {
          if (res.error) {
            PictureActions.togglePictureError(res.error);
          } else {
            PictureActions.togglePictureSuccess(res.Pictures);
          }
        })
        .catch((err) => {
          //console.log("TOGGLE ERR catch ", err);

          PictureActions.togglePictureError(err);
        });
    }


  static requestVisit(params) {
    //console.log("requestVisit", params[0], " && ", params[1]);
    PromiseApi.auth().post('/proposals/' + params[0] + '/visit', params[1])
    .then((result) => {
      //console.log("requestVisit service process");

        if (result.error) {
          //console.log("requestVisit service error");

          SearchActions.requestVisitError(result);
          return;
        }

        SearchActions.requestVisitSuccess(result);
    })
    .catch((err) => {
      //console.log("requestVisit service catch ", err);
        SearchActions.requestVisitError(err);
    });
  }
}

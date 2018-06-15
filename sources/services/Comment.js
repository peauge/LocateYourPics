import CommentsActions        from 'actions/Comment.js';
import PromiseApi             from 'services/promiseApi.js';


export default class CommentsApi {

  static getFrom(PictureId) {
    PromiseApi.auth().get(`/proposals/${PictureId}/comments`)
      .then((res) => {
        if (res.error) {
          CommentsActions.getError(res.error);
        } else {
          CommentsActions.getSuccess(res);
        }
      })
      .catch((err) => {
        CommentsActions.getError(err);
      });
  }

  static remove(obj) {
    console.log("remove comment", obj.PictureId, obj.id);
    PromiseApi.auth().delete(`/proposals/${obj.PictureId}/comments/${obj.id}`)
      .then((res) => {
        if (res.error) {
          CommentsActions.removeError(res.error);
        } else {
          CommentsActions.removeSuccess(res);
        }
      })
      .catch((err) => {
        CommentsActions.removeError(err);
      });
  }

  static toggleLike(obj) {
    // TODO : implement likes/dislikes
    PromiseApi.auth().put(`/proposals/${obj.PictureId}/comments/${obj.id}/likes`)
      .then((res) => {
        if (res.error) {
          CommentsActions.toggleLikeError(res.error);
        } else {
          CommentsActions.toggleLikeSuccess(res);
        }
      })
      .catch((err) => {
        CommentsActions.toggleLikeError(err);
      });
  }

  static create(postObj) {
    console.log("CREATE COMMENT API", postObj);
    PromiseApi.auth().post(`/proposals/${postObj.PictureId}/comments`, { post: postObj.post })
      .then((res) => {
          CommentsActions.createSuccess(res);
      })
      .catch((err) => {
        console.log("CATCH !!! COMMENT ERR", err);
        CommentsActions.createError(err);
      });
  }

}

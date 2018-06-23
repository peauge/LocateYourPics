import alt                from '../alt';
import CommentsActions    from 'actions/Comment.js';
import CommentsApi        from 'services/Comment.js';
import ErrorAlert         from 'framework/ErrorAlert.js'


class CommentsStore {

  constructor() {
    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
    this.comments   = [];
    this.id         = '';
    this.post       = '';
    this.errorAlert = new ErrorAlert();
    this.bindActions(CommentsActions);
  }

  onGet(PictureId) {
    CommentsApi.getFrom(PictureId);
    this.comments = [];
    return false;
  }

  onGetSuccess(result) {
    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
    this.comments = result.comments;
    this.id = result._id;
  }

  onGetError(error) {
    this.error.msg = error;
    this.error.origin = "Comment error";
    this.errorAlert.checkError(this.error);
  }

  onRemove(removeObj) {
    CommentsApi.remove(removeObj);
    return false;
  }

  onRemoveError(error) {
    this.error.msg = error;
    this.error.origin = "Comment error";
    this.errorAlert.checkError(this.error);
  }

  onRemoveSuccess(result) {
    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
    this.comments = result.comments;
    this.id = result._id;
  }


  onToggleLike(form) {
    CommentsApi.toggleLike(form);
    return false;
  }

  onToggleLikeSuccess(result) {
    this.comments = result.comments;
    this.id = result._id;
  }

  onToggleLikeError(error) {
    this.error.msg = error;
    this.error.origin = "Comment error";
    this.errorAlert.checkError(this.error);
    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
  }


  onCreate(post) {
    CommentsApi.create(post);
  }

  onCreateError(error) {
    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
  }

  onCreateSuccess(result) {

    this.error = {
      msg: "",
      origin: "",
      code: ""
    };
    this.comments = result.comments;
    this.id = result._id;
  }
}

export default alt.createStore(CommentsStore, 'CommentsStore');

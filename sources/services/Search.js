import PromiseApi    from './promiseApi.js';
import SearchActions from 'actions/Search.js';

export default class ProfileApi {

  static search(param) {
    console.log("Search service");
    var regex = '\\^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$';

    if (param.match(regex)) {
      PromiseApi.get('/api/users/email/' + param)
      .then((result) => {

          if (result.error) {
            SearchActions.requestSearchError(result);
            return;
          }

          SearchActions.requestSearchSuccess(result);
      })
      .catch((err) => {
        console.log("Search service catch ", err);
          SearchActions.requestSearchError(err);
      });
    } else {
      PromiseApi.post('/api/users/name/', param)
      .then((result) => {

          if (result.error) {
            SearchActions.requestSearchError(result);
            return;
          }

          SearchActions.requestSearchSuccess(result);
      })
      .catch((err) => {
        console.log("Search service catch ", err);
          SearchActions.requestSearchError(err);
      });
    }
  }
}

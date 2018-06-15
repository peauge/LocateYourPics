import PromiseApi    from './promiseApi.js';
import SearchActions from 'actions/Search.js';

export default class ProfileApi {

  static search(param) {
    console.log("Search service");
    PromiseApi.get('/public/search/filter/' + param)
    .then((result) => {
      //console.log("Search service process ", result);

        if (result.error) {
          //console.log("Search service error");

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

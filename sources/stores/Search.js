import alt           from '../alt';
import SearchActions from 'actions/Search.js';
import SearchApi     from 'services/Search.js';
import PictureApi     from 'services/Picture.js';
import ErrorAlert    from 'framework/ErrorAlert.js'
import PictureActions from 'actions/Pictures.js';

function extractWithFilter(array, filter, param) {
  return Array.isArray(array) ? array.filter(item => {for(var i in item){
    if (i == filter) {
      //console.log("extractWithFilter", item[i])
      if (Array.isArray(item[i])) {
        var subItem = item[i];
        for(var i in subItem){
          if (subItem[i].match(new RegExp(param, "i"))) {
            return item;
          }
        }
      }
      else if (item[i].match(new RegExp(param, "i"))) {
        return item;
      }
    }
  }}) : array;
  //console.log("extractWithFilterResult", result);
}

class SearchStore {
    constructor() {
        this.profiles = [];
        this.Pictures = [];
        //this.profileIds = "";
        //this.PictureIds = "";
        this.error = {
          msg: "",
          origin: "",
          code: ""
        };
        this.param = "";
        this.filterAd = "none"
        this.filterPr = "none"
        this.errorAlert = new ErrorAlert();
        this.selectedItem = null;
        this.bindActions(SearchActions);
        this.bindActions(PictureActions);
        //this.extractWithFilter = this.extractWithFilter.bind(this);
    }

    onRequestSearch(param) {
        this.param = param;
        SearchApi.search(param);
        return false;
    }

    onRequestSearchSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      console.log("Jesuisla");
        this.profiles = this.filterPr == "none" ? res.profiles : extractWithFilter(res.profiles, this.filterPr, this.param);
        this.Pictures = this.filterAd == "none" ? res.Pictures : extractWithFilter(res.Pictures, this.filterAd, this.param);
        this.profiles.map((profile) => {
          var i = 0;
          profile._id = res.ids[i];
          i++;
        });
        this.Pictures.map((Picture) => {
          PictureApi.findPictures(Picture._id);
        })
    }

    onRequestSearchError(error) {
        this.error.msg = error;
        this.error.origin = "Search Error";
        this.errorAlert.checkError(this.error);
    }

    onChangeFilterAd(newFilter) {
      this.filterAd = newFilter;
      console.log("filter***", this.filterAd);
      if (this.param && this.param != "")
        this.onRequestSearch(this.param);
      return true;
    }

    onChangeFilterPr(newFilter) {
      this.filterPr = newFilter;
      console.log("filter***", this.filterPr);
      if (this.param && this.param != "")
        this.onRequestSearch(this.param);
      return true;
    }

    onRequestVisit(params) {
        PictureApi.requestVisit(params);
        return false;
    }

    onRequestVisitSuccess(res) {
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
    }

    onRequestVisitError(error) {
        this.error.msg = error;
        this.error.origin = "Request Visit Error";
        this.errorAlert.checkError(this.error);
    }

    onPicturePictureSuccess(res) {
      console.log("onPicturePictureSuccess");
      this.error = {
        msg: "",
        origin: "",
        code: ""
      };
      for (Picture of this.Pictures) {
        if (Picture._id == res[0]) {
          Picture.photos = res[1];
          break ;
        }
      }
    }

    onPicturePictureError(error) {
        this.error.msg = error;
        this.error.origin = "Picture Picture Error";
        this.errorAlert.checkError(this.error);
    }
}

export default alt.createStore(SearchStore, 'SearchStore');

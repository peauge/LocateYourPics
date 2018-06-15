import alt                from '../alt';
//import * as Keychain      from 'react-native-keychain';
import AccountActions     from 'actions/Account.js';
import ProfileActions     from 'actions/Profile.js';
import PictureActions      from 'actions/Pictures.js';
import LocationActions    from 'actions/Location.js';
import CommentActions    from 'actions/Comment.js';
import SearchActions      from 'actions/Search.js';
import AccountApi         from 'services/Account.js';
import LocationApi        from 'services/Location.js';
import LocationStore      from 'stores/Location.js';
import sendLocation       from 'backgroundJobs/geolocation.js';
import notificationsJob   from 'backgroundJobs/visitRequestNotifications.js';
import BackgroundTimer    from 'react-native-background-timer';
import ErrorAlert         from 'framework/ErrorAlert.js'



class AccountStore {
    constructor() {
        this.account = null;
        this.isGuide = null;
        this.code = null;
        this.msg = null;
        this.credentials = null;
        this.form = null;
        this.alert = null;
        this.origin = null;
        this.watchId = null;
        this.notifsId = null;
        this.notification = true;
        this.passwordForm = {
          password : "",
          newPassword : "",
          passwordAgain : ""
        };
        this.mailForm = {
          password : "",
          newMail : "",
          emailAgain : ""
        };
        this.errorAlert = new ErrorAlert();
        this.isBlocking = false;
        this.whatChange = null;

        this.bindActions(AccountActions);
    }

    onRequestSignup(form) {
        this.form = form
        //this.account = form;
        AccountApi.signup(form);
        return false;
    }

    onRequestSignupSuccess(result) {
        this.code = result.code;
        this.msg = result.message;
        AccountActions.requestSignin.defer({"email" : this.form.email,
                                         "password" : this.form.password});
    }

    onRequestSignupError(result) {
        this.origin = "Sign up Error";
        this.code = result.code;
        this.msg = result;
        this.account = null;
        this.alert = true;
    }

    onAlertDismiss() {
      this.whatChange = null;
      this.code = null;
      this.alert = false;
    }

    onRequestSignin(form) {
        this.form = form;
        AccountApi.signin(form);
        return false;
    }

    onRequestSigninSuccess(result) {
            // Persistent save of the connection
        //Keychain.setGenericPassword(this.form.email, this.form.password);
        this.alert = false;
        this.code = 1;
        this.msg = result.message;
        this.credentials = {
          token: result.token,
          id: result.id,
        };
        navigator.geolocation.getCurrentPosition(
          (position) => {
                LocationActions.sendLocation(position.coords);
          }, (err) => {
            console.log('ERROR(' + err.code + '): ' + err.message);
          }//, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
        );
        this.notifsId = BackgroundTimer.setInterval(notificationsJob, 10000);

        LocationApi.getNearGuides(0.0922);
        LocationApi.nearAds(0.0922);

        AccountApi.getAccount(this.credentials.id);
        AccountApi.isGuide(result.id);
    }

    onRequestSigninError(result) {
        this.msg = result;
        this.origin = "Sign in Error";
        this.alert = true;
    }

    onIsGuideSuccess(result) {
      this.whatChange = null;
      this.isGuide = result.isGuide;
      this.watchId = sendLocation();
      PictureActions.getMyPictures.defer();
    }

    onIsGuideError(result) {
      // this.code = result.code;
      this.msg = result;
      this.origin = "Is guide error";
      this.alert = true;
    }

    onGetAccount() {
      AccountApi.getAccount(this.credentials.id);
      return false;
    }

    onGetAccountSuccess(result) {
        //console.log("onGetAccountSuccess : ", result);
        this.code = 0;
        this.msg = result.message;
        this.account = result;
        ProfileActions.getMyProfile.defer(this.credentials.id);
    }

    onGetAccountError(result) {
            // this.code = result.code;
        this.msg = result;
        this.origin = "Account error";
    }


    onRequestSignout() {
      AccountApi.signout();
      return false;
    }

    onRequestSignoutSuccess(result) {
      console.log("LOGOUT SUCCESS!")
        //Keychain.resetGenericPassword();
        if (this.isGuide == true) {
          navigator.geolocation.clearWatch(this.watchId);
        }
        BackgroundTimer.clearInterval(this.notifsId);
        this.code = null;
        this.account = null;
        // alt.flush() clean all the stores
        //console.log(alt.flush());
    }

    onRequestSignoutError(result) {
      console.log("LOGOUT FAILURE!")

      this.code = result.code;
      this.msg = result;
      this.origin = "Sign out error"
      this.alert = true;
      this.errorAlert.checkError(this);

    }

    onUpdatePassword(form) {
      this.whatChange = null;
      this.origin = "Update Password"
      if (form.passwordForm.newPassword == "" ||
          form.passwordForm.password == "" ||
          form.passwordForm.passwordAgain == "") {
        this.msg = "Please fill in all the fields.";
        this.errorAlert.checkError(this);
      }
      else {
      if (form.passwordForm.newPassword !== form.passwordForm.passwordAgain) {
        this.msg = "the password does not match";
        this.errorAlert.checkError(this);
       } else {
         if (form.passwordForm.newPassword === form.passwordForm.password) {
           this.msg = "Your new password needs to be different";
           this.errorAlert.checkError(this);
         } else {
           AccountApi.updatePassword({"password": form.passwordForm.newPassword, "currentPassword": form.passwordForm.password});
         }
       }
     }
     return false;
    }

// TODO : errorAlert => popup validation
     onUpdatePasswordSuccess(result) {
       //console.log('PASSWORD UPDATE : ', result);
       this.msg = "Your password has been successfully updated!";
       this.origin = "Password Updated";
       this.errorAlert.checkError(this);
       this.origin = null;
       this.msg = null;
     }

     onUpdatePasswordError(result) {
       //console.log('PASSWORD UPDATE ERROR : ', result)
       // this.code = result.code;
       this.msg = result;
       this.origin = "Password Update Error";
       this.alert = true;
       this.errorAlert.checkError(this);
     }

     onUpdateMail(form) {
       this.whatChange = null;
       this.origin = "Update Mail"
       if (form.mailForm.newMail == "" ||
           form.mailForm.password == "" ||
           form.mailForm.emailAgain == "") {
         this.msg = "Please fill in all the fields.";
         this.errorAlert.checkError(this);
       }
       else {
       if (form.mailForm.newMail !== form.mailForm.emailAgain) {
         this.msg = "the mail does not match";
         this.errorAlert.checkError(this);
        } else {
            AccountApi.updateMail({email: form.mailForm.newMail});
          }
        }
        return false;
      }

      onUpdateMailSuccess(result) {
        //console.log('MAIL UPDATE SUCCESS : ', result);
        this.msg = "A mail with a link to confirm your new address mail has been sent!";
        this.origin = "Mail Updated";
        this.errorAlert.checkError(this);
        this.origin = null;
        this.msg = null;
      }

      onUpdateMailError(result) {
        //console.log('Mail UPDATE : ', result)
        // this.code = result.code;
        this.msg = result;
        this.origin = "Mail Update Error"
        this.alert = true;
        this.errorAlert.checkError(this);
      }

    onRequestDelete(form) {
      this.whatChange = null;
      this.code = null;
        console.log('**DeleteAccount**', form);
        this.signin = form;
        AccountApi.delete(form);
        return false;
    }

    onRequestDeleteSuccess(result) {
        if (this.isGuide == true) {
          navigator.geolocation.clearWatch(this.watchId);
        }
        BackgroundTimer.clearInterval(this.notifsId);
        // alt.flush() clean all the stores
        console.log(alt.flush());
        console.log('**Clear AccountStore**');

    }

    onRequestDeleteError(result) {
        // this.code = result.code;
        if (result)
          this.msg = result;
        else {
          this.msg = "Please make sure all the fields are filled correctly."
        }
        this.origin = "Delete account error"
        this.alert = true;
        this.errorAlert.checkError(this);
      }

      onUpdateNotification(bool) {
        this.notification = bool;
      }

    onAccountBlocked() {
      console.log("Account blocked !!");
      this.whatChange = "isBlocking";
      this.isBlocking = true;
    }

    onAccountUnblocked() {
      console.log("Account unblocked !!");
      this.isBlocking = false;
      this.whatChange = "isUnblocking";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          LocationActions.sendLocation(position.coords);
        }, (err) => {
          console.log('ERROR(' + err.code + '): ' + err.message);
        }
      );
    }
}

export default alt.createStore(AccountStore, 'AccountStore');

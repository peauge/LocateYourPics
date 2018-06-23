import PromiseApi        from './promiseApi.js';
import AccountActions    from 'actions/Account.js';

export default class AccountApi {
    static signup(form) {
      PromiseApi.post('/api/users', form)
        // PromiseApi.post('/public/sign-up', form)
        .then((result) => {
            console.log("Status !!! : ", result);
            // if (result.code != 0) {
            //     AccountActions.requestSignupError(result);
            //     return;
            // }
            AccountActions.requestSignupSuccess(result);
        })
        .catch((err) => {
            //console.log("Error SignUp" + err);
            // if (String(err.response.text) === '{"code":1,"message":"Forbidden"}')
            //     SignupActions.requestSignupSuccess({code: 0, message : "Compte crée."});
            // else
                AccountActions.requestSignupError(err);
        });
    }

    static signin(form) {
      // PromiseApi.post('/public/sign-in', form)
        PromiseApi.post('/api/users/login', form)
        .then((result) => {
            if (result.code && result.code != 0) {
                AccountActions.requestSigninError(result);
                return;
            }
            AccountActions.requestSigninSuccess(result);
        })
        .catch((err) => {
            AccountActions.requestSigninError(err);
        });
    }

    static getAccount(id) {
      // PromiseApi.auth().get('/accounts/' + id)
        PromiseApi.auth().get('/users/:' + id)
        .then((result) => {
            if (result.code && result.code != 0) {
                AccountActions.getAccountError(result);
                return;
            }
            AccountActions.getAccountSuccess(result);
        })
        .catch((err) => {
            AccountActions.getAccountError(err);
        });
    }

    static signout(form) {
        PromiseApi.auth().put('/accounts/logout', form)
        .then((result) => {
            if (result.error) {
                AccountActions.requestSignoutError(result);
                return;
            }
            AccountActions.requestSignoutSuccess(result);
        })
        .catch((err) => {
            AccountActions.requestSignoutError(err);
        });
    }

    static updatePassword(form) {
        PromiseApi.auth().put('/accounts/password', form)
          .then((res) => {
            if (res.error) {
              AccountActions.updatePasswordError(res);
            } else {
              AccountActions.updatePasswordSuccess(res);
            }
          })
          .catch((err) => {
            AccountActions.updatePasswordError(err);
          });
          return ;
      }

      static updateMail(form) {
        PromiseApi.auth().put('/accounts/mail', form)
          .then((res) => {
            if (res.error) {
              AccountActions.updateMailError(res);
            } else {
              AccountActions.updateMailSuccess(res);
            }
          })
          .catch((err) => {
            AccountActions.updateMailError(err);
          });
          return ;
      }

    static delete(form) {
      PromiseApi.auth().delete('/api/users/:', form.User.id)
      // PromiseApi.auth().put('/users/remove', form.User)
        .then((result) => {
            if (result.error) {
                AccountActions.requestDeleteError(result);
                return;
            }
            AccountActions.requestDeleteSuccess(result);
        })
        .catch((err) => {
            AccountActions.requestDeleteError(err);
        });
    }
}

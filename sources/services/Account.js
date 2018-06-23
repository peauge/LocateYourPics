import PromiseApi        from './promiseApi.js';
import AccountActions    from 'actions/Account.js';

export default class AccountApi {
    static signup(form) {
      PromiseApi.post('/api/users', form)
        .then((result) => {
            console.log("Status SignUp: " + result);
            AccountActions.requestSignupSuccess(result);
        })
        .catch((err) => {
          console.log("Error SignUp: " + err);
          AccountActions.requestSignupError(err);
        });
    }

    static signin(form) {
      PromiseApi.post('/api/users/login', form)
      .then((result) => {
        if (result.status && result.status == "success") {
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
        PromiseApi.get('/api/users/' + id)
        .then((result) => {
            if (result.code && result.code > 300) {
                AccountActions.getAccountError(result);
                return;
            }
            AccountActions.getAccountSuccess(result);
        })
        .catch((err) => {
            AccountActions.getAccountError(err);
        });
    }

/*
** TODO server side
**
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
*/

    static delete(form) {
      PromiseApi.delete('api/users/', form.User.id)
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

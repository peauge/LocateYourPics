import alt from '../alt';

export default alt.generateActions('requestSignup', 'requestSignupError', 'requestSignupSuccess',
                                   'requestSignin', 'requestSigninError', 'requestSigninSuccess',
                                   'getAccount', 'getAccountSuccess', 'getAccountError',
                                   'alertDismiss',
                                   'requestSignout', 'requestSignoutError', 'requestSignoutSuccess',
                                   'requestDelete', 'requestDeleteError', 'requestDeleteSuccess',
                                   'updateNotification',
                                    'updateMail', 'updateMailError', 'updateMailSuccess',
                                    'updatePassword', 'updatePasswordError', 'updatePasswordSuccess',
                                    'accountBlocked', 'accountUnblocked', 'invalidateAccount');

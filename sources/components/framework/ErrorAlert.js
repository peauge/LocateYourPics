/**
 * Created by peauge on 20/02/2017.
 */
'use strict'
// TODO : make it works Alert fait maison pour le moment + multilangue
// import SimpleAlert from 'react-native-simpledialog-android'
import _          from 'underscore';
import {Alert}    from "react-native";


var ErrorAlert = class ErrorAlertClass {
    checkError (obj) {

        let errorMessage = 'An unexpected error occured';
        let errorOrigin  = 'Error';

        if (!_.isNull(obj)) {
            if (!_.isUndefined(obj.error)) {
                if (!_.isUndefined(obj.error.error)) {
                    errorMessage = obj.error.error;
                } else {
                    errorMessage = obj.error;
                }
            } else {
                errorMessage = obj;
            }
            if (!_.isNull(errorMessage.origin) && !_.isUndefined(errorMessage.origin))
              errorOrigin = errorMessage.origin;
            if (errorMessage !== '') {
              console.log(errorMessage);
                    // Alert.alert(typeof errorOrigin === "string" ? errorOrigin : "Error",
                    //   !_.isUndefined(errorMessage.msg) && typeof errorMessage.msg === "string" ? errorMessage.msg : errorMessage,
                    //   [
                    //     {text: 'OK', onPress: () => console.log('OK Pressed from Alert')},
                    //   ],
                    //   { cancelable: false });
                }
            }
        }
    }

module.exports = ErrorAlert;

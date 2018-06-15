import request from 'superagent';

import { config } from '../config.js';
import AuthStore from 'stores/Account.js';
import RNFetchBlob    from 'react-native-fetch-blob';
import AccountActions from 'actions/Account.js';

export default class PromiseApi {

  static auth() {
    const newInstance = Object.create(PromiseApi);
    const credentials = AuthStore.getState().credentials;

    if (credentials) { newInstance.token = credentials.token; }

    return newInstance;
  }

  static _handleResponse(requestBuilder, callbacks) {
    requestBuilder.end((err, res) => {
      if (err) {
        if (String(err).indexOf('Request has been terminated') !== -1) {
          callbacks.reject('Server seems to be down, please try again later');
        } else {
          let errorMessage = err.statusText;

          try {
            errorMessage = JSON.parse(res.text).message;
          } catch (e) {
            errorMessage = 'An unexpected error occured';
          }

          if (res.forbidden) {
            AccountActions.accountBlocked();
          }

          callbacks.reject(errorMessage);
        }
      } else {
        try { const jsonBody = JSON.parse(res.text);
          if (jsonBody.code !== undefined && jsonBody.code !== 0) {
            callbacks.reject(`${jsonBody.message} (code ${jsonBody.code})`);
          } else {
            callbacks.resolve(jsonBody);
          }
        } catch(err) {
          callbacks.reject("Invalid JSON response");
        }
      }
    });
  }

  static get(url) {
    return new Promise((resolve, reject) => {
      const requestBuilder = request.get(`${config.apiUrl}${url}`);

      if (this.token) { requestBuilder.set('Authorization', `Bearer ${this.token}`); }

      PromiseApi._handleResponse(requestBuilder, { resolve, reject });
    });
  }

  static post(url, body) {
    return new Promise((resolve, reject) => {
      const requestBuilder = request
        .post(`${config.apiUrl}${url}`, JSON.stringify(body))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      if (this.token) { requestBuilder.set('Authorization', `Bearer ${this.token}`); }

      PromiseApi._handleResponse(requestBuilder, { resolve, reject });
    });
  }

  static upload(url, body) {
    return new Promise((resolve, reject) => {
      const requestBuilder = request
        .post(`${config.apiUrl}${url}`, body)
        .set('Accept', 'application/json')
        .set('Content-Type', 'multipart/form-data');

      if (this.token) { requestBuilder.set('Authorization', `Bearer ${this.token}`); }

      PromiseApi._handleResponse(requestBuilder, { resolve, reject });
    });
  }

  static uploads(url, body, files, method = 'POST') {
    return new Promise((resolve, reject) => {
      console.log(':::files : ', files);
      console.log('body', body);
      // const filesUpload = [];//new FormData();
      // files.map((file) => {
      //   console.log("file : ", file);
      //   filesUpload.push({ name : file.name, filename : file.name, type : file.type, data : file.uri});
      // });
      // filesUpload.push({name : 'proposalForm', data : JSON.stringify(body)});
      // console.log("files : ", filesUpload);
      // RNFetchBlob.fetch('POST', `${config.apiUrl}${url}`, {
      //   'Authorization' : `Bearer ${this.token}`,
      //   'Content-Type' : 'multipart/form-data',
      // }, filesUpload)
      // .then((res) => {
      //   console.log('*****Upload**** ', res, ' **********');
      //   resolve(res.base64());
      // })
      // .catch((errorMessage, statusCode) => {
      //   console.log("Upload error : ", errorMessage);
      //   reject('Upload failed');
      // });
      const req = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('proposalForm', JSON.stringify(body));
      console.log(':::files : ', files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('::file:: ', file);
        formData.append(file.name, file);
      }

      req.addEventListener('load', function callback() {
        if (req.status === 200) {
          resolve(JSON.parse(this.response));
        } else {
          reject('Upload failed');
        }
      });

      req.open(method, `${config.apiUrl}${url}`, true);

      if (this.token) { req.setRequestHeader('Authorization', `Bearer ${this.token}`); }
      console.log(formData);
      req.send(formData);
    });
  }

  static download(url) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch('GET', `${config.apiUrl}${url}`, {
        Authorization : 'Bearer ${this.token}',
      })
      .then((res) => {
        console.log('*****download**** ');
        resolve(res.base64());
      })
      .catch((errorMessage, statusCode) => {
        console.log("Download error : ", errorMessage);
        reject('Download failed');
      });
    });
      /*const req = new XMLHttpRequest();

      const callback = () => {
        if (req.status === 200) {
          const blob = new Blob([req.response], { type: 'image/jpeg' });
          const reader = new FileReader();
          reader.onload = (dataLoad) => {
            resolve(dataLoad.target.result);
          };

          reader.readAsDataURL(blob);
        } else {
          reject('Download failed');
        }
      };

      req.addEventListener('load', callback);
      req.open('GET', `${config.apiUrl}${url}`, true);

      if (this.token) { req.setRequestHeader('Authorization', `Bearer ${this.token}`); }

      req.responseType = 'arraybuffer';
      req.send(null);
    });*/
  }

  static put(url, body) {
    return new Promise((resolve, reject) => {
      const requestBuilder = request
        .put(`${config.apiUrl}${url}`, JSON.stringify(body))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      if (this.token) { requestBuilder.set('Authorization', `Bearer ${this.token}`); }

      PromiseApi._handleResponse(requestBuilder, { resolve, reject });
    });
  }

  static delete(url) {
    return new Promise((resolve, reject) => {
      const requestBuilder = request.delete(`${config.apiUrl}${url}`);

      if (this.token) { requestBuilder.set('Authorization', `Bearer ${this.token}`); }

      PromiseApi._handleResponse(requestBuilder, { resolve, reject });
    });
  }

}

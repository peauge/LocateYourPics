import PromiseApi    from './promiseApi.js';
import AvatarCache from 'stores/cache/Avatar.js';
import CacheAvatarActions from 'actions/CacheAvatar.js';

const retrieveFromCache = (hash) => {
  const cache = AvatarCache.getState();
  const cacheIndex = cache.hashMap.indexOf(hash);

  if (cacheIndex !== -1) {
    return cache.avatars[cacheIndex];
  }

  return null;
};

const retrieveAvatar = (id, forceCache) => {
  return new Promise((resolve, reject) => {
    const avatar = retrieveFromCache(id);

    if (avatar && forceCache !== true) {
      resolve(avatar);
    } else {
      PromiseApi.download(`/api/users/${id}/avatar`)
        .then((res) => {
          console.log("Avatar");
          const block = {};
          block[id] = res;
          CacheAvatarActions.cache.defer(block);
          resolve(res);
        })
        .catch(err => reject(err));
    }
  });
};

export default class AvatarApi {

  static getAvatars(ids, haveAvatars) {
    return new Promise((resolve, reject) => {
      new Promise((resolveHas, rejectHas) => {
        if (ids.length !== haveAvatars.length) {
          Promise
          .all(ids.map(id => this.hasAvatar(id)))
          .then(res => resolveHas(res.map(el => el.hasAvatar)))
          .catch(err => rejectHas(err));
        } else {
          resolveHas(haveAvatars);
        }
      })
      .then((userHaveAvatars) => {
        Promise
          .all(ids.map((id, index) => {
            const hasAvatar = userHaveAvatars[index];

            if (hasAvatar) {
              return retrieveAvatar(id);
            }

            return Promise.resolve('images/avatar.png');
          }))
          .then(avatars => resolve(avatars))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
  }

  static hasAvatar(userId) {
    return PromiseApi.get(`/public/profiles/${userId}/avatar/available`);
  }
}

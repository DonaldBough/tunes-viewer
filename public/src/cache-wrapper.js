'use strict';

import ErrorMonitor from "./error-monitor.js";

export default class CacheWrapper {

  static OWNER_ADDRESS_CACHE_KEY = 'owner_address';
  static getString(key) {
    if (!this._isLocalStorageSupported()) { return null }

    return window.localStorage.getItem(key);
  }

  static setString(key, stringValue) {
    window.localStorage.setItem(key, stringValue);
  }

  static getObject(key) {
    if (!this._isLocalStorageSupported()) { return null }

    const object = window.localStorage.getItem(key);
    const parsedObject = (object) ? JSON.parse(object) : null;

    if (parsedObject) { ErrorMonitor.logDebug(`Got object for ${key} from cache`) }
    return parsedObject;
  }

  static setObject(key, object) {
    if (!this._isLocalStorageSupported()) { return }

    if (object === null || object === undefined || typeof object !== 'object') {
      this.removeItem(key);
      ErrorMonitor.logDebug(`Key was removed from trying to set ${JSON.stringify(object)} in cache`);
      return
    }
    window.localStorage.setItem(key, JSON.stringify(object));
    ErrorMonitor.logDebug(`Set key ${key} to an object in cache`);
  }

  static removeItem(key) {
    if (!this._isLocalStorageSupported()) { return }

    window.localStorage.removeItem(key);
    ErrorMonitor.logDebug(`Removed key ${key} in cache`);
  }

  static _isLocalStorageSupported() {
    try {
      const key = "__a_random_key_you_are_not_going_to_use__";
      window.localStorage.setItem(key, key);
      window.localStorage.removeItem(key);
      return true;
    }
    catch (error) {
      JobPlatformGlobals.logError(new Error('Local storage was not supported, logging just to be safe'));
      return false;
    }
  }
}
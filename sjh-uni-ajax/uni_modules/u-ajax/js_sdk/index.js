/*!
 * uni-ajax v2.2.8
 * Developed by ponjs
 * https://github.com/ponjs/uni-ajax
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ajax = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class Interceptor {
    constructor() {
      this.fulfilled = res => res;
      this.rejected = err => err;
    }
    use(fulfilled, rejected) {
      typeof fulfilled === 'function' && (this.fulfilled = fulfilled);
      typeof rejected === 'function' && (this.rejected = rejected);
    }
  }

  function createRequest() {
    var _class, _temp;
    return _temp = _class = class Request extends Promise {
      static onHeadersReceived(fn) {
        if (typeof fn === 'function') {
          Request.onHeadRcvd = fn;
        }
        if (Request.onHeadRcvd && Request.requestTask) {
          var _Request$requestTask$, _Request$requestTask;
          (_Request$requestTask$ = (_Request$requestTask = Request.requestTask).onHeadersReceived) === null || _Request$requestTask$ === void 0 ? void 0 : _Request$requestTask$.call(_Request$requestTask, Request.onHeadRcvd);
        }
      }
      static offHeadersReceived(fn) {
        if (typeof fn === 'function') {
          Request.offHeadRcvd = fn;
        }
        if (Request.offHeadRcvd && Request.requestTask) {
          var _Request$requestTask$2, _Request$requestTask2;
          (_Request$requestTask$2 = (_Request$requestTask2 = Request.requestTask).offHeadersReceived) === null || _Request$requestTask$2 === void 0 ? void 0 : _Request$requestTask$2.call(_Request$requestTask2, Request.offHeadRcvd);
        }
      }
      abort() {
        var _Request$requestTask3;
        Request.aborted = true;
        (_Request$requestTask3 = Request.requestTask) === null || _Request$requestTask3 === void 0 ? void 0 : _Request$requestTask3.abort();
        return this;
      }
      onHeadersReceived(fn) {
        Request.onHeadersReceived(fn);
        return this;
      }
      offHeadersReceived(fn) {
        Request.offHeadersReceived(fn);
        return this;
      }
    }, _defineProperty(_class, "requestTask", null), _defineProperty(_class, "aborted", false), _defineProperty(_class, "onHeadRcvd", null), _defineProperty(_class, "offHeadRcvd", null), _temp;
  }

  const _toString = Object.prototype.toString;
  function isArray(val) {
    return _toString.call(val) === '[object Array]';
  }
  function isObject(val) {
    return _toString.call(val) === '[object Object]';
  }
  function forEach(obj, fn) {
    if (obj === null || obj === undefined) return;
    if (typeof obj !== 'object') obj = [obj];
    if (isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          fn.call(null, obj[k], k, obj);
        }
      }
    }
  }
  function merge(...args) {
    const result = {};
    for (let i = 0, l = args.length; i < l; i++) {
      isObject(args[i]) && forEach(args[i], (val, key) => result[key] = assign(result[key], val));
    }
    return result;
  }
  function assign(target, source) {
    if (isObject(target) && isObject(source)) {
      return merge(target, source);
    } else if (isObject(source)) {
      return merge({}, source);
    } else if (isArray(source)) {
      return source.slice();
    }
    return source;
  }

  const METHOD = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'];
  const HEADER = ['common', ...METHOD];
  const defaults = {
    header: {},
    method: 'GET',
    timeout: 30000,
    dataType: 'json',
    responseType: 'text',
    sslVerify: true,
    withCredentials: false,
    firstIpv4: false,
    validateStatus: statusCode => statusCode >= 200 && statusCode < 300
  };
  forEach(HEADER, h => defaults.header[h] = {});

  function detachConfig(url, data, config) {
    const callback = {};
    const params = {};
    const isSingle = typeof url === 'object';
    const value = isSingle ? url : { ...config,
      url,
      data
    };
    forEach(value, (val, key) => {
      if (isCallback(key) && isSingle) callback[key] = val;else params[key] = val;
    });
    return {
      callback,
      params
    };
  }
  function mergeConfig(config1, config2 = {}) {
    const config = {};
    const configKeys = Object.keys({ ...config1,
      ...config2
    });
    forEach(configKeys, prop => {
      if (config2[prop] !== undefined) {
        config[prop] = assign(config1[prop], config2[prop]);
      } else if (config1[prop] !== undefined) {
        config[prop] = assign(undefined, config1[prop]);
      }
    });
    config.method = config.method.toUpperCase();
    return config;
  }
  function isCallback(field) {
    return ['success', 'fail', 'complete'].includes(field);
  }
  function combineURL(baseURL = '', relativeURL = '') {
    if (/^https?:\/\//.test(relativeURL)) return relativeURL;
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
  }
  function originURL(baseURL = '') {
    if (!/^https?:\/\//.test(baseURL)) return '';
    const u = baseURL.split('/');
    return u[0] + '//' + u[2];
  }
  function buildURL(url, params) {
    if (!params) return url;
    let query;
    const parts = [];
    forEach(params, (val, key) => {
      if (val === null || typeof val === 'undefined') return;
      if (isArray(val)) key = key + '[]';else val = [val];
      forEach(val, v => {
        if (v !== null && typeof v === 'object') {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });
    query = parts.join('&');
    if (query) {
      const hashmarkIndex = url.indexOf('#');
      hashmarkIndex !== -1 && (url = url.slice(0, hashmarkIndex));
      url += (url.indexOf('?') === -1 ? '?' : '&') + query;
    }
    return url;
  }
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
  }

  async function handleRequest(request) {
    const params = mergeConfig(await this.config, request);
    const config = await this.request.interceptors.request.fulfilled(params);
    if (!isObject(config)) {
      const error = await this.request.interceptors.request.rejected({
        config,
        errMsg: 'request:fail parameter'
      });
      return Promise.reject(error);
    }
    config.url = buildURL(combineURL(config.baseURL, config.url), config.params);
    config.method = (config.method || 'GET').toUpperCase();
    config.header = merge(config.header.common, config.header[config.method.toLowerCase()], config.header);
    forEach(HEADER, h => isObject(config.header[h]) && delete config.header[h]);
    forEach(config, (val, key) => isCallback(key) && delete config[key]);
    return config;
  }
  function handleResponse({
    config,
    callback,
    ...promise
  }) {
    return async res => {
      var _callback$field, _callback$complete;
      try {
        const state = !config.validateStatus || config.validateStatus(res.statusCode) ? 'fulfilled' : 'rejected';
        var result = await this.request.interceptors.response[state]({
          config,
          ...res
        });
        var field = state === 'fulfilled' ? 'success' : 'fail';
      } catch (error) {
        result = error;
        field = 'fail';
      }
      if (!Object.keys(callback).length) {
        return promise[field === 'success' ? 'resolve' : 'reject'](result);
      }
      (_callback$field = callback[field]) === null || _callback$field === void 0 ? void 0 : _callback$field.call(callback, result);
      (_callback$complete = callback.complete) === null || _callback$complete === void 0 ? void 0 : _callback$complete.call(callback, result);
    };
  }

  class Ajax {
    constructor(_config) {
      _defineProperty(this, "request", (...args) => {
        const {
          callback,
          params
        } = detachConfig(...args);
        const fields = Object.keys(callback);
        const Request = createRequest();
        return new Request(async (resolve, reject) => {
          try {
            var config = await this.handleRequest(params);
          } catch (error) {
            var _callback$fail, _callback$complete;
            (_callback$fail = callback.fail) === null || _callback$fail === void 0 ? void 0 : _callback$fail.call(callback, error);
            (_callback$complete = callback.complete) === null || _callback$complete === void 0 ? void 0 : _callback$complete.call(callback, error);
            return !fields.length && reject(error);
          }
          const complete = this.handleResponse({
            config,
            callback,
            resolve,
            reject
          });
          if (Request.aborted) return complete({
            errMsg: 'request:fail abort'
          });
          Request.requestTask = uni.request({ ...config,
            complete
          });
          typeof config.xhr === 'function' && config.xhr(Request.requestTask, config);
          fields.length && resolve(Request.requestTask);
          Request.onHeadersReceived();
          Request.offHeadersReceived();
        });
      });
      this.config = _config;
      this.handleRequest = handleRequest;
      this.handleResponse = handleResponse;
      this.request.interceptors = {
        request: new Interceptor(),
        response: new Interceptor()
      }
      ;
      (async () => {
        this.request.baseURL = (await this.config).baseURL || '';
        this.request.origin = originURL(this.request.baseURL);
      })();
      this.request.config = async fn => this.config = await fn(this._config);
      forEach(METHOD, method => {
        this.request[method] = (url, data, config) => this.request(...(typeof url === 'string' ? [url, data, { ...config,
          method
        }] : [{ ...url,
          method
        }]));
      });
    }
    set config(config) {
      this._config = typeof config === 'function' ? async () => mergeConfig(defaults, await config()) : mergeConfig(defaults, config);
    }
    get config() {
      return typeof this._config === 'function' ? this._config() : this._config;
    }
  }

  function createInstance(defaultConfig) {
    return new Ajax(defaultConfig).request;
  }
  const ajax = createInstance();
  ajax.create = function create(instanceConfig) {
    return createInstance(instanceConfig);
  };

  return ajax;

})));

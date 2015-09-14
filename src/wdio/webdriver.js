'use strict';

import webdriverio from 'webdriverio';
import q from 'q';
import _ from 'lodash';
import wdioConfigs from './../../wdio.conf'

let configs = Symbol();
let instance = Symbol();

export default class WebDriver {
  constructor() {
    this[configs] = wdioConfigs;

    this[instance] = webdriverio.remote(this[configs]);
  }
  start() {
    this[instance] = this[instance].init();

    return this;
  }
  end() {
    this[instance].end();
    this[instance] = undefined;

    return this;
  }
  openUrl(url) {
    return this[instance].url(url).then((res) => {
      return {
        message: `url ${url} opened correctly`,
        data: res
      };
    }).catch((err) => {
      return {
        message: `error on open url ${url}`,
        error: err
      };
    });
  }

  click(params) {
    return this[instance].click(params.selector).then((res) => {
      return {
        message: `success on click in element ${params.selector}`,
        data: res
      };
    }).catch((err) => {
      return {
        message: `error on click in element ${params.selector}`,
        error: err
      };
    });
  }

  setValue(params) {
    return this[instance].setValue(params.selector, params.value).then((res) => {
      return {
        message: `success on set value ${params.value} in element ${params.selector}`,
        data: res
      };
    }).catch((err) => {
      return {
        message: `error on set value ${params.value} in element ${params.selector}`,
        error: err
      };
    });
  }

  hasClass(params) {
    let defer = q.defer();

    this[instance].getAttribute(params.selector, 'class').then((res) => {
      if (!rest || !res.length) {
        return defer.resolve({
          message: `there are no classes on element ${params.selector}`,
          error: err
        });
      }

      if (_.some(res.split(" "), params.value)) {
        return defer.resolve({
          message: `className ${params.value} found in element ${params.selector}`,
          data: res
        });
      }

      return defer.reject({
        message: `className ${params.value} not found in element ${params.selector}`,
        data: res
      });
    }).catch((err) => {
      return defer.reject({
        message: `error on get classes of element ${params.selector}`,
        error: err
      });
    });

    return defer.promise;
  }

  checkValue(params) {
    let defer = q.defer();

    this[instance].getValue(params.selector).then((res) => {
      if (res === params.value) {
        return defer.resolve({
          message: `The value ${params.value} of element ${params.selector} is same as expected`,
          data: res
        });
      }

      return defer.resolve({
        message: `The value ${params.value} of element ${params.selector} is not same as expected`,
        data: res
      });
    }).catch((err) => {
      return defer.reject({
        message: `error on get actual value of element ${params.selector}`,
        error: err
      });
    });

    return defer.promise;
  }

  checkVisibility(params) {
    let defer = q.defer();

    this[instance].isVisible(params.selector).then((visible) => {
      if (visible) {
        return defer.resolve({
          message: `The element ${params.selector} is visible`,
          data: res
        });
      }

      return defer.resolve({
        message: `The element ${params.selector} is not visible`,
        data: res
      });
    }).catch((err) => {
      return defer.reject({
        message: `error on get visibility of element ${params.selector}`,
        error: err
      });
    });

    return defer.promise;
  }

  elementExists(params) {
    let defer = q.defer();

    this[instance].isExisting(params.selector).then((exist) => {
      if (exist) {
        return defer.resolve({
          message: `The element ${params.selector} is exists in page`,
          data: res
        });
      }
      return defer.resolve({
        message: `The element ${params.selector} not exist in page`,
        data: res
      });
    }).catch((err) => {
      return defer.reject({
        message: `error on check existence of element ${params.selector} in page`,
        error: err
      });
    });

    return defer.promise;
  }

  checkUrl(params) {
    let defer = q.defer();

    this[instance].url().then((res) => {
      if (res.value.indexOf(params.value) > -1) {
        return defer.resolve({
          message: `Actual url is same as expected`,
          data: res
        });
      }
      return defer.resolve({
        message: `Actual url is not same as ${params.value}`,
        data: res
      });
    }).catch((err) => {
      return defer.reject({
        message: `error on get actual url`,
        error: err
      });
    });

    return defer.promise;
  }
}

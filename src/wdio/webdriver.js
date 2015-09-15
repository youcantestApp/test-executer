'use strict';

import webdriverio from 'webdriverio';
import q from 'q';
import _ from 'lodash';
import wdioConfigs from './../../wdio.conf'

let configs = Symbol('configs'), instance = Symbol('instance');

export default class WebDriver {
  constructor() {
    this[configs] = wdioConfigs;
    this[instance] = webdriverio.remote(this[configs]);
  }

  start() {
    return this[instance].init().then((res) => {
      console.log('started');
    });
  }

  end() {
    this[instance].end();
    this[instance] = undefined;

    console.log("finish");

    return this;
  }

  execute(alias, data) {
    let fn = this.fnMapper(alias);

    return q.ninvoke(this, fn, data).then((data) => {
      return data;
    }, (err) => {
      return err;
    });
  }

  fnMapper(alias) {
    if(typeof(this[alias]) === 'function') {
      return alias;
    }

    if(alias === 'assertValue'){
      return 'checkValue';
    }
    if(alias === 'isElementVisible'){
      return 'checkVisibility';
    }
    if(alias === 'isElementExists'){
      return 'elementExists';
    }

    throw 'Function not found!';
  }

  openUrl(url) {
    let defer = q.defer();

    this[instance].url(url).then((res) => {
      return defer.resolve({
        result: 'success',
        message: `url ${url} opened correctly`,
        data: res,
        params: url
      });
    },(err) => {
      return defer.reject({
        result: 'fail',
        message: `error on open url ${url}`,
        error: err,
        params: url
      });
    });

    return defer.promise;
  }

  click(params) {
    return this[instance].click(params.selector).then((res) => {
      return {
        result: 'success',
        message: `success on click in element ${params.selector}`,
        data: res,
        params: params
      };
    }, (err) => {
      return {
        result: 'fail',
        message: `error on click in element ${params.selector}`,
        error: err,
        params: params
      };
    });
  }

  setValue(params) {
    return this[instance].setValue(params.selector, params.value).then((res) => {
      return {
        result: 'success',
        message: `success on set value ${params.value} in element ${params.selector}`,
        data: res,
        params: params
      };
    },(err) => {
      return {
        result: 'fail',
        message: `error on set value ${params.value} in element ${params.selector}`,
        error: err,
        params: params
      };
    });
  }

  hasClass(params) {
    let defer = q.defer();

    this[instance].getAttribute(params.selector, 'class').then((res) => {
      if (!rest || !res.length) {
        return defer.resolve({
          result: 'fail',
          message: `there are no classes on element ${params.selector}`,
          error: err,
          params: params
        });
      }

      if (_.some(res.split(" "), params.value)) {
        return defer.resolve({
          result: 'success',
          message: `className ${params.value} found in element ${params.selector}`,
          data: res,
          params: params
        });
      }

      return defer.reject({
        result: 'fail',
        message: `className ${params.value} not found in element ${params.selector}`,
        data: res,
        params: params
      });
    },(err) => {
      return defer.reject({
        result: 'fail',
        message: `error on get classes of element ${params.selector}`,
        error: err,
        params: params
      });
    });

    return defer.promise;
  }

  checkValue(params) {
    let defer = q.defer();

    this[instance].getValue(params.selector).then((res) => {
      if (res === params.value) {
        return defer.resolve({
          result: 'success',
          message: `The value ${params.value} of element ${params.selector} is same as expected`,
          data: res,
          params: params
        });
      }

      return defer.resolve({
        result: 'fail',
        message: `The value ${params.value} of element ${params.selector} is not same as expected`,
        data: res,
        params: params
      });
    },(err) => {
      return defer.reject({
        result: 'fail',
        message: `error on get actual value of element ${params.selector}`,
        error: err,
        params: params
      });
    });

    return defer.promise;
  }

  checkVisibility(params) {
    let defer = q.defer();

    this[instance].isVisible(params.selector).then((visible) => {
      if (visible) {
        return defer.resolve({
          result: 'success',
          message: `The element ${params.selector} is visible`,
          data: visible,
          params: params
        });
      }

      return defer.resolve({
        result: 'fail',
        message: `The element ${params.selector} is not visible`,
        data: visible,
        params: params
      });
    }, (err) => {
      return defer.reject({
        result: 'fail',
        message: `error on get visibility of element ${params.selector}`,
        error: err,
        params: params
      });
    });

    return defer.promise;
  }

  elementExists(params) {
    return this[instance].isExisting(params.selector).then((exist) => {
      if (exist) {
        return {
          result: 'success',
          message: `The element ${params.selector} is exists in page`,
          data: exist,
          params: params
        };
      }
      return {
        result: 'fail',
        message: `The element ${params.selector} not exist in page`,
        data: exist,
        params: params
      };
    },(err) => {
      return {
        result: 'fail',
        message: `error on check existence of element ${params.selector} in page`,
        error: err,
        params: params
      };
    });
  }

  checkUrl(params) {
    let defer = q.defer();

    this[instance].url().then((res) => {
      if (res.value.indexOf(params.value) > -1) {
        return defer.resolve({
          result: 'success',
          message: `Actual url is same as expected`,
          data: res,
          params: params
        });
      }
      return defer.resolve({
        result: 'fail',
        message: `Actual url is not same as ${params.value}`,
        data: res,
        params: params
      });
    },(err) => {
      return defer.reject({
        result: 'fail',
        message: `error on get actual url`,
        error: err,
        params: params
      });
    });

    return defer.promise;
  }
}

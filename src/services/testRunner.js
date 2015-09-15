'use strict';

import q from 'q';
import _ from 'lodash';
import WebDriver from './../wdio/webdriver'

let wdInstance = Symbol();

export default class TestRunnerService {
  constructor() {
    this[wdInstance] = new WebDriver();
  }

  run(test) {
    let starter = q.defer();

    let result = {
      context: [],
      actions: [],
      asserts: []
    };

    //initial function for trigger
    let executionSequence = (() => {
      return starter.promise;
    })();

    //chaining start wdio fn
    executionSequence = executionSequence.then(() =>{
      let defer = q.defer();

      this[wdInstance].start().then((res) => {
        this[wdInstance].openUrl(test.context.url).then((data) => {
          result.context.push(data);

          return defer.resolve(data);
        }, (err) => {
          result.context.push(err);

          return defer.reject(err);
        });
      }, (err) => {
        result.context.push(err);

        return defer.reject(err);
      });

      return defer.promise;
    });

    let chainFn = (element) => {
      executionSequence = executionSequence.then(() => {
        let fnName = this[wdInstance].fnMapper(element.type);

        return this[wdInstance][fnName](element).then((res) => {
          result.asserts.push(res);
        }, (err) => {
          result.asserts.push(err);
        });
      });
    };


    //foreach action, chaining in sequence
    _.each(test.actions, chainFn);
    //foreach assert, chaining in sequence
    _.each(test.asserts, chainFn);

    //chaining start wdio fn
    executionSequence = executionSequence.then(() => {
      this[wdInstance].end();
      return result;
    });

    starter.resolve();

    return executionSequence;
  }
}

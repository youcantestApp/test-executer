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
      actions: [],
      asserts: []
    };

    //initial function for trigger
    let executionSequence = (() => {
      return starter.promise;
    })();

    //chaining start wdio fn
    executionSequence = executionSequence.then(() =>{
      this[wdInstance].start();
      return q.defer().resolve();
    });


    //foreach action, chaining in sequence
    _.each(test.actions, (element) => {
      executionSequence = executionSequence.then(() => {
        return this[wdInstance].execute(element.type, element).then((res) => {
          result.actions.push(res);
        }, (err) => {
          result.actions.push(err);
        });
      });
    });

    //foreach assert, chaining in sequence
    _.each(test.asserts, (element) => {
      executionSequence = executionSequence.then(() => {
        return this[wdInstance].execute(element.type, element).then((res) =>{
          result.asserts.push(res);
        }, (err) => {
          result.asserts.push(err);
        });
      });
    });

    //chaining start wdio fn
    let finisher = q.defer();
    executionSequence = executionSequence.finally(() => {
      this[wdInstance].end();

      return finisher.resolve(result);
    });

    starter.resolve();

    return finisher.promise;
  }
}

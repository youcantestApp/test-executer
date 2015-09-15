'use strict';

import q from 'q';
import WebDriver from './../wdio/webdriver'

let wdInstance = Symbol();

export default class TestRunnerService {
  constructor() {
    this[wdInstance] = new WebDriver();
  }

  run(test) {
    this[starter] = q.defer();

    //initial function for trigger
    let executionSequence = () => {
      return this[starter].promise;
    };

    //chaining start wdio fn
    executionSequence = executionSequence.then(() =>{
      this[wdInstance].start();
      return q.defer().resolve();
    });

    //foreach action, chaining in sequence
    _.each(test.actions, (element) => {
      executionSequence = executionSequence.then(() => {
        return this[wdInstance].execute(element.type, element);
      });
    });

    //foreach assert, chaining in sequence
    _.each(test.asserts, (element) => {
      executionSequence = executionSequence.then(() => {
        return this[wdInstance].execute(element.type, element);
      });
    });

    //chaining start wdio fn
    executionSequence = executionSequence.then(() =>{
      this[wdInstance].end();
      return q.defer().resolve();
    });

    this[sequence] = executionSequence;
  }
}

'use strict';

import q from 'q';
import _ from 'lodash';

import TestRunnerService from './testRunner';
import TestRepository from './../repositories/test';
import TestResultRepository from './../repositories/testResult';
import ScheduleRepository from './../repositories/schedule';

let testResultRep = Symbol(), scheduleRep = Symbol(), testRep = Symbol(), testRunner = Symbol(),
currUser = Symbol(), currTest = Symbol(), currSchedule = Symbol();

export default class ExecuterService {
  constructor(config) {
    this[testRunner] = new TestRunnerService();
    this[testRep] = new TestRepository(config);
    this[testResultRep] = new TestResultRepository(config);
    this[scheduleRep] = new ScheduleRepository(config);
  }

  _getTargetTest(scheduleId) {
    let defer = q.defer();

    //getting schedule data from database
    this[scheduleRep].getById(scheduleId).then((schedule) => {
      if (!schedule || !schedule.testId) {
        return defer.reject({message: "Error on retrieve schedule ${scheduleId} data"});
  		}

      this[currUser] = schedule.user;
      this[currSchedule] = schedule;

      this[testRep].getById(schedule.testId).then((test) => {
        this[currTest] = test;

        return defer.resolve({
          message: "Success on retrieve test from schedule ${scheduleId}",
          data: test
        });
      }, (err) => {
          return defer.reject(err);
      });
    }, (err) => {
        return defer.reject(err);
    });

    return defer.promise;
  }

  _executeTargetTest() {
    let defer = q.defer();

    this[testRunner].run(this[currTest]).then((result) => {
      return defer.resolve(result);
    }, (err) => {
      return defer.reject(err);
    });

    return defer.promise;
  }

  _persistResult(result) {
    let data = {};

  	data.user = this[currUser];
  	data.scheduleId = this[currSchedule]._id.toString();
  	data.testId = this[currTest]._id.toString();
  	data.testName = this[currTest].name;
  	data.actions = result.actions;
  	data.asserts = result.asserts;
  	data.executionDate = new Date();

    //TODO - ACERTAR ESSE TEST SUCCEED
  	data.testSucceed = (() => {
      let actSucceed = data.actions.length === 0 || (_.countby(data.actions, 'result').success === this[currtest].actions.length);
      let assSucceed = data.asserts.length > 0 && (_.countBy(data.asserts, 'result').success === this[currTest].asserts.length);

      return actSucceed && assSucceed;
    })();

    return this[testResultRep].save(data).then((res) => console.log('saved with success', res), (err) => console.log('err', err));
  }

  run(data) {
    let scheduleId = data.scheduleId;

    return this._getTargetTest(scheduleId)
    .then((res) => { return this._executeTargetTest(); })
    .then((res) => { return this._persistResult(res); })
    .fail((err) => {
       return defer.reject(err);
    });
  }
}

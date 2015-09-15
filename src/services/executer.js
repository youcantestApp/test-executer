'use strict';

import q from 'q';

import TestRunnerService from './services/testRunner';
import TestRepository from './repositories/test';
import ScheduleRepository from './repositories/schedule';

let scheduleRep = Symbol(), testRep = Symbol(), testRunner = Symbol(),
currUser = Symbol(), currTest = Symbol(), currSchedule = Symbol();

export default class ExecuterService {
  constructor(config) {
    this[testRunner] = new TestRunnerService();
    this[testRep] = new TestRepository(config);
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

    this[testRunner].prepare(this[currTest]).run().then((result) => {

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
  	data.testSucceed = undefined;

    return this[testResultRep].saveOne(data);
  }

  run(scheduleId) {
    let defer = q.defer();

    this._getTargetTest(scheduleId)
    .then(this._executeTargetTest)
    .then(this._persistResult)
    .fail((err) => {
       return defer.reject(err);
    });

    return defer.promise;
  }
}

'use strict';

import ScheduleRepository from './repositories/schedule';
import TestRepository from './repositories/tests';

let configs = Symbol();

export default class QueueConsumer {
  constructor(config) {
    this[configs] = config;
  }
  start() {
  }
}

'use strict';

import ScheduleRepository from './repositories/schedule';
import TestRepository from './repositories/tests';
import WebDriverService from './services/webdriver';

let configs = Symbol();

export default class QueueConsumer {
  constructor(config) {
    this[configs] = config;
  }
  start() {
    let instance = new WebDriverService();

    instance.start().openUrl('www.globo.com').then((data) => console.log(data));

  }
}

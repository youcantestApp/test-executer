'use strict';

import ExecuterService from './services/executer';
import QueueService from './services/queue';

let configs = Symbol();

export default class QueueConsumer {
  constructor(config) {
    this[configs] = config;
  }
  start() {
    let scheduleQueueService = new QueueService({
      connection: this[configs].connections.queue,
      queue: this[configs].queues.schedule
    });

    scheduleQueueService.prepare().then((msg) => {
      console.log("prepared", msg);
      try {
        scheduleQueueService.startListen((content) => {
          console.log('content received');

          let executer = new ExecuterService();

          executer.run(content);

        });
      }
      catch (err) {
        console.log('error on start listen queue messages', err);
      }
    },(err) => {
      console.log('error on prepare', err);
      return;
    });
  }
}

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
          console.log('content received', content);

          let executer = new ExecuterService(this[configs]);

          return executer.run(content).then((res) => {
            console.log({
              message:'success on execute and persist test',
              data: res
            });
          }, (err) => {
            console.log({
              message:'error on execute and persist test',
              data: err
            });
          });
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

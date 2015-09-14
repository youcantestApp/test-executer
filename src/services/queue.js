'use strict';

import {config as queueConfigs} from  './../../queue.config';
import amqp from 'amqplib';
import q from 'q';

let instanceUrl = Symbol(), instanceConfig = Symbol();

export default class QueueService {
  constructor(instanceConfigs) {
    this[instanceUrl] = instanceConfigs.connection;
    this[instanceConfig] = instanceConfigs.queue;
  }

  prepare() {
    let defer = q.defer();

    amqp.connect(this[instanceUrl]).then((conn) => {
      conn.createChannel().then((channel) => {
      	var queue = channel.assertQueue(this[instanceConfig].main, queueConfigs.queue.options).then(() => {
          channel.prefetch(queueConfigs.PREFETCH_NUMBER);

          this.channel = channel;

          defer.resolve({message: 'ready to consume'});
        }, (err) => {
          defer.reject({message: 'error on check or create queue', err: err});
        });
      }, (err) => {
        defer.reject({message: 'error on create or get queue channel', err: err});
      });
    }, (err) => {
      defer.reject({message: 'error on connect to queue', err: err});
    });

    return defer.promise;
  }

  startListen(handler) {
    if(typeof(handler) !== 'function') {
      throw 'callback parameter is not a function';
    }

    this.channel.consume(this[instanceConfig].main, (message) => {
      console.log("[x] message received", "content", message.content.toString()); 
      var content = message.content.toString();
      try {
        var content = JSON.parse(content);

        handler(content);
      }
      catch(error) {
        console.log({message: 'error on parse message', err:error});
      }
    }, queueConfigs.queue.consumeOpts);
  }
}

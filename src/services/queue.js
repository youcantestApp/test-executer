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
        channel.prefetch(queueConfigs.PREFETCH_NUMBER);
        console.log(queueConfigs);
      	var queue = channel.assertQueue(this[instanceConfig].main, queueConfigs.queue.options).then(() => {

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
      console.log("[x] message received");

      let that = this;
      try {
        let content = message.content.toString();
        content = JSON.parse(content);

        handler(content).fail(()=> {
          that.publishError(message.content);
        }).fin(() => {
          that.channel.ack(message).then((res) => console.log('acked', res));
        });
      }
      catch(error) {
        this.publishError(message.content);
        console.log({message: 'error on parse message', err: error});
        that.channel.ack(message).then((res) => console.log('acked', res));
      }
    }, queueConfigs.queue.consumeOpts);
  }

  publishError(message) {
    console.log('publishing error');
    return this.channel.sendToQueue(this[instanceConfig].error, message);
  }

}

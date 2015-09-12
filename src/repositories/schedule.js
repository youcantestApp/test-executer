'use strict';

import BaseRepository from './base'

export default class ScheduleRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this.collection = 'schedules';
  }
}

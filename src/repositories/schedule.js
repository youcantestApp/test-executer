'use strict';

export default class ScheduleRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this[collection] = 'schedules';
  }
}

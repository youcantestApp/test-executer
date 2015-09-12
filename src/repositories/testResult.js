'use strict';

export default class TestResultRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this[collection] = 'testResults';
  }
}

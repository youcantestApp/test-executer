'use strict';

import BaseRepository from './base'

export default class TestResultRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this.collection = 'testResults';
  }
}

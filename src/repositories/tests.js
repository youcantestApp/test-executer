'use strict';

import BaseRepository from './base'

export default class TestRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this.collection = 'tests';
  }
}

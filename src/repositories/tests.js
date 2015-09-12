'use strict';

export default class TestRepository extends BaseRepository {
  constructor(config) {
    super(config);
    this[collection] = 'tests';
  }
}

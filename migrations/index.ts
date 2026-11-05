import * as migration_20261105_075224_init_blog from './20261105_075224_init_blog';

export const migrations = [
  {
    up: migration_20261105_075224_init_blog.up,
    down: migration_20261105_075224_init_blog.down,
    name: '20261105_075224_init_blog'
  },
];

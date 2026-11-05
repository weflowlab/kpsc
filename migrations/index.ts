import * as migration_20261105_075224_init_blog from './20261105_075224_init_blog';
import * as migration_20261105_081815_media_blob_object_key from './20261105_081815_media_blob_object_key';

export const migrations = [
  {
    up: migration_20261105_075224_init_blog.up,
    down: migration_20261105_075224_init_blog.down,
    name: '20261105_075224_init_blog',
  },
  {
    up: migration_20261105_081815_media_blob_object_key.up,
    down: migration_20261105_081815_media_blob_object_key.down,
    name: '20261105_081815_media_blob_object_key'
  },
];

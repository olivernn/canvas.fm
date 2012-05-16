CREATE TABLE `tracks` (
  `id` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `artist_name` varchar(255) NOT NULL DEFAULT '',
  `play_count` int(11) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tracks_created_at` (`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

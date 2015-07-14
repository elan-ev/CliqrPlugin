CREATE TABLE IF NOT EXISTS `votehistory` (
  `history_id` varchar(32) NOT NULL,
  `startdate` int(20) NOT NULL,
  `vote_id` varchar(32)  NOT NULL,
  `answer` varchar(255) NOT NULL,
  `counter` int(11) NOT NULL DEFAULT '0',
  `position` int(11) NOT NULL DEFAULT '0',
   PRIMARY KEY (`history_id`),
   KEY `startdate` (`startdate`,`vote_id`,`position`)
);
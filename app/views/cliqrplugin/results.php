<?php
global $sess;
require_once "{$GLOBALS["STUDIP_BASE_PATH"]}/lib/vote/view/vote_show.lib.php";

echo createBoxLineHeader();
echo createVoteHeadline($vote, true);
echo createBoxContentHeader();
echo createVoteResult($vote);
echo createBoxContentFooter();
echo createBoxLineFooter();
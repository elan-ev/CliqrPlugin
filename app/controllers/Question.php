<?
namespace Cliqr;

require_once "lib/vote/Vote.class.php";
require_once "errors.php";

class Question extends \Vote {

    static function find($id)
    {
        $question = new Question($id);
        if ($question->isError()) {
            throw new RecordNotFound();
        }
        return $question;
    }

    static function findAll($range_id)
    {
        $_range_id = self::transformRangeId($range_id);

        // get a list of all active questions
        $voteDb = new \VoteDB();
        $questions = array_merge(
            $voteDb->getNewVotes($_range_id),
            $voteDb->getActiveVotes($_range_id),
            $voteDb->getStoppedVotes($_range_id));

        foreach($questions as $index => &$question) {
            $questions[$index] = new Question($question["voteID"]);
        }

        // order questions by title
        usort($questions, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });
        return $questions;
    }

    static function findAllActive($range_id)
    {
        return self::_findAllActive(self::transformRangeId($range_id));
    }

    static private function _findAllActive($_range_id)
    {
        # get a list of all active questions
        $voteDb = new \VoteDB();
        $questions = $voteDb->getActiveVotes($_range_id);

        # inflate
        $questions = array_map(
            function ($q) {
                return new Question($q["voteID"]);
            },
            $questions);

        # order by startdate
        usort($questions, function($a, $b) {
                if ($a->startdate === $b->startdate) { return 0; }
                return $a->startdate < $b->startdate ? -1 : +1;
            });

        return $questions;
    }

    static function consolidateState($range_id)
    {
        $_range_id = self::transformRangeId($range_id);

        $voteDb = new \VoteDB();
        $voteDb->startWaitingVotes($_range_id);
    }

    static function transformRangeId($range_id)
    {
        return md5("cliqr-$range_id");
    }


    static function makeChoices($choices)
    {
        # reject empty
        $choices = array_filter($choices, function ($choice) { return strlen($choice); });

        foreach ($choices as &$choice) {
            $choice = self::makeChoice($choice);
        }

        return $choices;
    }

    static function makeChoice($choice)
    {
        return array(
            'answer_id' => md5(uniqid(rand())),
            'text'      => $choice,
            'counter'   => 0,
            'correct'   => 0);
    }

    /********************/
    /* INSTANCE METHODS */
    /********************/

    function isActiveIn($range_id)
    {
        $_range_id = self::transformRangeId($range_id);
        return $this->rangeID === $_range_id && $this->isActive();
    }

    function recordAnswer($answer_id)
    {
	
        if (!$this->isActive()) {
            $this->throwError(23, _("Nur aktive Fragen können beantwortet werden."));
            return false;
        }

        $sql = "UPDATE voteanswers SET counter = counter + 1 ".
               "WHERE vote_id = ? AND answer_id = ?";
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute(array($this->getVoteID(), $answer_id));

        if ($stmt->rowCount() !== 1) {
            $this->throwError(24, _("Antwort wurde nicht gespeichert."));
            return false;
        }

        # update locally
        foreach ($this->answerArray as &$answer) {
            if ($answer['answer_id'] === $answer_id) {
                $answer['counter']++;
            }
        }

				
		$sql = "SELECT history_id FROM votehistory JOIN vote ON vote.vote_id = votehistory.vote_id ".
			   "JOIN voteanswers ON votehistory.answer = voteanswers.answer ".
			   "WHERE votehistory.vote_id = ? AND vote.startdate = votehistory.startdate AND answer_id = ?";
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute(array($this->getVoteID(), $answer_id));
		
		if ($stmt->rowCount() == 0) {				
		
			$sql = "SELECT startdate, answer, counter, position FROM voteanswers JOIN vote ON vote.vote_id = voteanswers.vote_id ".
				   "WHERE voteanswers.vote_id = ?";
			$stmt = \DBManager::get()->prepare($sql);
			$stmt->execute(array($this->getVoteID()));
			
			foreach($stmt as $row){
				
				$history_id = md5(uniqid(rand()));	
				
				$sql = "INSERT INTO votehistory (history_id, startdate, vote_id, answer, counter, position) ".
					   "VALUES (?, ?, ?, ?, ?, ?)";
				$stmt = \DBManager::get()->prepare($sql);
				$stmt->execute(array($history_id, $row['startdate'], $this->getVoteID(), $row['answer'], $row['counter'], $row['position']));			
			}
		}
		else{
			
			foreach($stmt as $row){
			
				$sql = "UPDATE votehistory SET counter = counter + 1 ".
					   "WHERE history_id = ?";
				$stmt2 = \DBManager::get()->prepare($sql);
				$stmt2->execute(array($row['history_id']));
				break;
				
			}
		}

        return true;
    }

    const ACTIVE_TIMESPAN = 7200; //60 * 60 * 2 = 2h

    function start($stop_others = TRUE)
    {
        # stop all questions
        if ($stop_others) {
            $_range_id = $this->rangeID;
            self::stopAll($_range_id);
        }

        # then start this one
        $this->setStopdate(time() + self::ACTIVE_TIMESPAN);

        if ($this->isNew()) {
            $this->executeStart();
        } else {
            $this->executeRestart();
            $this->executeContinue();
        }
        $ok = !$this->isError();

        if ($ok) {
            \NotificationCenter::postNotification('QuestionDidStart', $this);
        }

        return $ok;
    }

    function stop()
    {
        $this->executeStop();
        $ok = !$this->isError();

        if ($ok) {
            \NotificationCenter::postNotification('QuestionDidStop', $this);
        }

        return $ok;
    }


    /**
     * Stop all questions of a specific range_id.
     *
     * TODO potential performance problems
     *
     * @param string $range_id  the id of the course/institute
     */
    static private function stopAll($_range_id)
    {
        $questions = self::_findAllActive($_range_id);
        foreach ($questions as $question) {
            $status = $question->stop();
        }
    }


    function toJSON($with_counter = true)
    {
        $answers = array();
        foreach ($this->answerArray as $answer) {
            $ary = array(
                'id'      => studip_utf8encode($answer['answer_id']),
                'text'    => studip_utf8encode($answer['text']));
            if ($with_counter) {
                $ary['counter'] = (int)$answer['counter'];
            }
            $answers[] = $ary;
        }
        return array(
            'id'        => $this->objectID,
            'question'  => studip_utf8encode($this->question),
            'startdate' => (int)$this->getStartdate(),
            'stopdate'  => (int)$this->getStopdate(),
            'state'     => $this->getState(),
            'answers'   => $answers
        );
    }
	
	
}

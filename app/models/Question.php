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

    static function findAll($_range_id)
    {
        $range_id = self::transformRangeId($_range_id);

        // get a list of all active questions
        $voteDb = new \VoteDB();
        $questions = array_merge(
            $voteDb->getNewVotes($range_id),
            $voteDb->getActiveVotes($range_id),
            $voteDb->getStoppedVotes($range_id));

        foreach($questions as $index => &$question) {
            $questions[$index] = new Question($question["voteID"]);
        }

        // order questions by title
        usort($questions, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });
        return $questions;
    }

    static function findAllActive($_range_id)
    {
        $range_id = self::transformRangeId($_range_id);

        # get a list of all active questions
        $voteDb = new \VoteDB();
        $questions = $voteDb->getActiveVotes($range_id);

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

    static function consolidateState($_range_id)
    {
        $range_id = self::transformRangeId($_range_id);

        $voteDb = new \VoteDB();
        $voteDb->startWaitingVotes($range_id);
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

        return true;
    }

    const ACTIVE_TIMESPAN = 7200; //60 * 60 * 2 = 2h

    /**
     * TODO
     */
    function start()
    {
        $this->setStopdate(time() + self::ACTIVE_TIMESPAN);

        if ($this->isNew()) {
            $this->executeStart();
        } else {
            $this->executeContinue();
        }
        $ok = !$this->isError();

        if ($ok) {
            \NotificationCenter::postNotification('QuestionDidStart', $this);
        }

        return $ok;
    }

    /**
     * TODO
     */
    function stop()
    {
        $this->executeStop();
        $ok = !$this->isError();

        if ($ok) {
            \NotificationCenter::postNotification('QuestionDidStop', $this);
        }

        return $ok;
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
            'range_id'  => studip_utf8encode($this->rangeID),
            'question'  => studip_utf8encode($this->question),
            'startdate' => (int)$this->getStartdate(),
            'answers'   => $answers
        );
    }
}

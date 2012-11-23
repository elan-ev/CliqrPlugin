<?

namespace Cliqr;

require_once "lib/vote/Vote.class.php";
require_once "errors.php";

class Question extends \Vote{

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

    static function find($id)
    {
        $question = new Question($id);
        if ($question->isError()) {
            throw new RecordNotFound();
        }
        return $question;
    }

    static function findActiveByRangeID($range_id)
    {
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

    function toJSON()
    {
        $answers = array();
        foreach ($this->answerArray as $answer) {
            $answers[$answer['answer_id']] = array(
                'text' => studip_utf8encode($answer['text']),
                'counter' => (int)$answer['counter']);
        }
        return array(
            'id'       => $this->objectID,
            'range_id' => studip_utf8encode($this->rangeID),
            'question' => studip_utf8encode($this->question),
            'answers'  => $answers
        );
    }

/*
    function __construct($range_id, $title, $answers, $attrs = array())
    {
        $now = time();

        $answers = array_filter($answers, function ($answer) { return strlen($answer); });
        $answers = array_map(function ($answer) { return \Cliqr\Question::makeAnswer($answer); }, $answers);

        $defaults = array(
  x            'vote_id'          => self::generateID()
  x          , 'range_id'         => $range_id
  x          , 'title'            => $title
  x          , 'question'         => $title
            , 'author_id'        => $GLOBALS['user']->id
            , 'type'             => 'vote'
x            , 'state'            => 'new'
 x           , 'startdate'        => $now
 x           , 'stopdate'         => NULL
 x           , 'timespan'         => NULL
 x           , 'mkdate'           => $now
 x           , 'chdate'           => $now
 x           , 'resultvisibility' => 'ever'
 x           , 'multiplechoice'   => 0
 x           , 'anonymous'        => 1
 x           , 'changeable'       => 0
 x           , 'co_visibility'    => NULL
 x           , 'namesvisibility'  => 0

            , 'answers'          => $answers
        );
        $this->attrs = array_merge($defaults, $attrs);
    }

    function save()
    {
        $questionDB = new \VoteDB();
        $questionDB->writeVote (
            $this->attrs['vote_id'],
            $this->attrs['author_id'],
            $this->attrs['range_id'],
            $this->attrs['title'],
            $this->attrs['question'],
            $this->attrs['state'],
            $this->attrs['startdate'],
            $this->attrs['stopdate'],
            $this->attrs['timespan'],
            $this->attrs['mkdate'],
            $this->attrs['chdate'],
            $this->attrs['resultvisibility'],
            $this->attrs['namesvisibility'],
            $this->attrs['multiplechoice'],
            $this->attrs['anonymous'],
            $this->attrs['answers'],
            $this->attrs['changeable'],
            $this->attrs['co_visibility'],
            $this->attrs['type']
        );
        return !$questionDB->isError();
    }
*/
}

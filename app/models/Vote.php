<?

namespace Cliqr;

require_once "lib/vote/Vote.class.php";

class Vote {

    static function makeAnswer($text)
    {
        return array( 'answer_id' => md5(uniqid(rand())),
                      'text'      => $text,
                      'counter'   => 0,
                      'correct'   => NO
        );
    }

    static function dummy()
    {
        $answers = array(self::makeAnswer("ja"), self::makeAnswer("nein"));
        $vote = new Vote(md5(uniqid(rand())), "13d5dbc69a4ae94c087f427cb37315a2", "@@@title@@@", $answers);

        return $vote;
    }

    static function find($id)
    {
        $vote = new \Vote($id);
        if ($vote->isError()) {
            return NULL;
        }
        return $vote;
    }


    function __construct($id, $range_id, $title, $answers, $attrs = array())
    {
        $now = time();
        $defaults = array(
              'vote_id'          => $id
            , 'range_id'         => $range_id
            , 'title'            => $title
            , 'question'         => $title
            , 'author_id'        => $GLOBALS['user']->id
            , 'type'             => 'vote'
            , 'state'            => 'new'
            , 'startdate'        => $now
            , 'stopdate'         => NULL
            , 'timespan'         => NULL
            , 'mkdate'           => $now
            , 'chdate'           => $now
            , 'resultvisibility' => 'ever'
            , 'multiplechoice'   => 0
            , 'anonymous'        => 1
            , 'changeable'       => 0
            , 'co_visibility'    => NULL
            , 'namesvisibility'  => 0

            , 'answers'          => $answers
        );
        $this->attrs = array_merge($defaults, $attrs);
    }

    function save()
    {
        $voteDB = new \VoteDB();
        $voteDB->writeVote (
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
        return $voteDB->isError();
    }
}

<?php

namespace Cliqr;

class QuestionPusher
{
    private $config;
    private $cid;

    public function __construct($config, $cid)
    {
        $this->config = $config;
        $this->cid = $cid;
    }

    public function observeNotifications()
    {
        \NotificationCenter::addObserver($this, 'onQuestionStarted', 'QuestionDidStart');
        \NotificationCenter::addObserver($this, 'onQuestionStopped', 'QuestionDidStop');
    }

    public function onQuestionStarted($notification, $question)
    {
        $user_data = $question->toJSON(false);
        $ok = $this->trigger('started', $user_data);
        // TODO was wenn es ein fehler ist?
    }

    public function onQuestionStopped($notification, $question)
    {
        $user_data = $question->getVoteID();
        $ok = $this->trigger('stopped', $user_data);
        // TODO was wenn es ein fehler ist?
    }

    private function trigger($event, $user_data)
    {
        $channel = $this->config['pusher_channel']($this->cid);
        $pusher = $this->config['pusher'];

        return $pusher->trigger($channel, $event, $user_data);
    }
}

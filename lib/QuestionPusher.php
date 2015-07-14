<?php

namespace Cliqr;

class QuestionPusher {

    function __construct($config, $cid)
    {
        $this->config = $config;
        $this->cid    = $cid;
    }

    function observeNotifications()
    {
        \NotificationCenter::addObserver($this, 'onQuestionStarted', 'QuestionDidStart');
        \NotificationCenter::addObserver($this, 'onQuestionStopped', 'QuestionDidStop');
    }


    function onQuestionStarted($notification, $question)
    {
        $user_data = $question->toJSON(false);
        $ok = $this->trigger('started', $user_data);
    }

    function onQuestionStopped($notification, $question)
    {
        $user_data = $question->getVoteID();
        $ok = $this->trigger('stopped', $user_data);
    }

    private function trigger($event, $user_data)
    {
        $channel = $this->config['pusher_channel']($this->cid);
        $pusher = $this->config['pusher'];
        return $pusher->trigger($channel, $event, $user_data);
    }
}

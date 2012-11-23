<?php
global $sess;
require_once "lib/vote/vote.config.php";
require_once "lib/vote/Vote.class.php";

require_once 'cliqr_controller.php';

use \Cliqr\Question;

class QuestionsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        global $perm;

        parent::before_filter($action, $args);

        $this->flash = Trails_Flash::instance();

        # set default layout
        $this->set_layout('layout');

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));

        $this->cid = Request::get("cid");

        // as anonymous access is possible, do not enable the course
        // navigation when the current user is not signed in
        # TODO
        if ($perm->have_studip_perm("autor", $this->cid)) {
            Navigation::activateItem("/course/cliqr/index");
        }

        # TODO authorisation

        # needs context
        if (in_array($action, words("edit update destroy")) && !$this->cid) {
            throw new Trails_Exception(400);
        }

        # set question
        if (in_array($action, words("show edit update destroy"))) {
            $this->question = Question::find($args[0]);
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function index_action() {
        // get a list of all active questions
        $voteDb = new VoteDB();
        $this->questions = array_merge(
            $voteDb->getNewVotes($this->cid),
            $voteDb->getActiveVotes($this->cid),
            $voteDb->getStoppedVotes($this->cid));

        foreach($this->questions as $index => &$question) {
            $this->questions[$index] = new Question($question["voteID"]);
        }

        // order questions by title
        usort($this->questions, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });

        if (Request::isXhr()) {
            $questions = array_map(function ($q) { return $q->toJSON(); }, $this->questions);
            $this->render_json($questions);
        }
    }

    function show_action($id)
    {
        $this->shortener = $this->plugin->container['shortener'];

        if (Request::isXhr()) {
            $this->render_json($this->question->toJSON());
        }
    }

    function new_action()
    {
        # just render template
    }

    function create_action()
    {
        global $auth;

        # TODO: Validation!? (eingebaut?)
        $question = new Question();
        $question->setRangeID($this->cid);
        $question->setAuthorID($auth->auth["uid"]);

        $question->setQuestion($q = Request::get("question"));
        $question->setTitle(my_substr($q, 0, 50));

        $choices = Question::makeChoices(Request::getArray("choices"));
        $question->setAnswers($choices);

        $question->executeWrite();
        $error = $question->isError();

        if (Request::isXhr()) {
            if ($error) {
                throw new Trails_Exception(500, "Could not create");
            } else {
                $this->response->set_status(201, "Created");
                return $this->render_json($question->toJSON());
            }
        }
        else {
            if ($error) {
                $this->flash['error'] = "Could not create question";
                return $this->redirect('questions/new');
            } else {
                $this->flash['info'] = "Question created";
                return $this->redirect('questions/show/'.$question->getVoteID());
            }
        }
    }

    function edit_action($id)
    {
        # just render template
    }

    # TODO: mit create_action kombinieren
    # TODO: Validation!? (eingebaut?)
    function update_action($id)
    {
        $question = $this->question;
        $question->setQuestion($q = Request::get("question"));
        $question->setTitle(my_substr($q, 0, 50));

        # TODO
        $answers = array();
        foreach ($question->getAnswers() as $answer) {
            $answers[$answer['answer_id']] = $answer;
        }
        $new_answers = array();
        foreach (Request::getArray("choices") as $id => $choice) {
            if ($choice !== '') {
                $new_answers[] = is_int($id)
                    ? Question::makeChoice($choice)
                    : array_merge($answers[$id], array('text' => $choice));
            }
        }
        $question->setAnswers($new_answers);


        $question->executeWrite();
        $error = $question->isError();

        if (Request::isXhr()) {
            if ($error) {
                throw new Trails_Exception(500, "Could not update");
            } else {
                $this->response->set_status(201, "Updated");
                return $this->render_json($question->toJSON());
            }
        }
        else {
            if (!$error) {
                $this->flash['error'] = "Could not update question";
                return $this->redirect('questions/edit/'.$question->getVoteID());
            } else {
                $this->flash['info'] = "Question updated";
                return $this->redirect('questions/show/'.$question->getVoteID());
            }
        }
    }

    function destroy_action($id)
    {
        $this->question->executeRemove();
        $error = $this->question->isError();

        if (Request::isXhr()) {
            if ($error) {
                throw new Trails_Exception(500, "Could not delete");
            } else {
                $this->response->set_status(204);
                return $this->render_nothing();
            }
        }
        else {
            if ($error) {
                $this->flash['error'] = "Could not delete question";
            } else {
                $this->flash['info'] = "Question deleted";
            }
            return $this->redirect('questions/index');
        }
    }

    /*


    function start_action($questionId)
    {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        if($vote->getRangeID() == Request::get("cid")) {
            $voteDb->startVote($voteId, VOTE_ACTIVE, $vote->getStartdate(),
                               null, null);
        }

        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/index"));
    }

    function stop_action($voteId)
    {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        if($vote->getRangeID() == Request::get("cid")) {
            $voteDb->stopVote($voteId, VOTE_STOPPED_VISIBLE, null);
        }

        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/index"));
    }

    function results_action($voteId)
    {
        if(Request::isXhr()) {
            $this->set_layout(null);
        }
        $this->vote = new Vote($voteId);
    }

    function showpublic_action($cid)
    {
        $voteDb = new VoteDB();
        $this->questions = $voteDb->getActiveVotes($courseid);
        foreach($this->votes as $index => &$vote) {
            $this->votes[$index] = new Vote($vote["voteID"]);
            $voteDb->setVote($this->votes[$index]);

            // users are not logged in, thus handle votes anonymous
            $this->votes[$index]->anonymous = true;

            // do not allow users to vote twice
            if($voteDb->isAssociated2(CliqrPlugin::getAnonymousUserId())) {
                unset($this->votes[$index]);
            }
        }

        // order votes by title
        usort($this->votes, function($a, $b) {
                return strcasecmp($a->title, $b->title);
            });
    }

    function vote_action($voteId) {
        $voteDb = new VoteDB();
        $vote = new Vote($voteId);

        $voteDb->participate($voteId, CliqrPlugin::getAnonymousUserId(),
                             Request::getArray("answer"), true);

        // get back to the vote view
        $this->redirect(PluginEngine::getURL($GLOBALS["plugin"], array(),
                                             "cliqrplugin/showpublic/" . $vote->getRangeID()));
    }

    */
}

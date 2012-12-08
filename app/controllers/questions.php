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
        parent::before_filter($action, $args);

        # needs context
        $this->cid = Request::get("cid");
        if (!isset($this->cid)) {
            throw new Trails_Exception(400);
        }

        // authorisation
        if (!$GLOBALS['perm']->have_studip_perm("tutor", $this->cid)) {
            throw new Trails_Exception(403);
        }


        $this->flash = Trails_Flash::instance();

        # set default layout
        $this->set_layout('layout');

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_('Cliqr'));

        if ($action === 'new') {
            Navigation::activateItem("/course/cliqr/new");
        } else {
            Navigation::activateItem("/course/cliqr/index");
        }

        # set question
        if (in_array($action, words("show edit update destroy start stop"))) {
            $this->question = Question::find($args[0]);
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function index_action() {
        $this->questions = Question::findAll($this->cid);

        if (Request::isXhr()) {
            $this->render_json(
                array_map(function ($q) {
                        return $q->toJSON();
                    }, $this->questions));
        }
    }

    function show_action($id)
    {
        $this->shortener = $this->plugin->config['shortener'];
        $this->show_results = Request::int("show_results", 1);

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

        // TODO: Validation!? (eingebaut?)
        $question = new Question();
        $question->setAuthorID($auth->auth["uid"]);

        // TODO: das ist so nicht sauber, das müsste Question machen
        $question->setRangeID(Question::transformRangeId($this->cid));

        // TODO: woher weiss ich, dass das UTF8 ist?
        $question->setQuestion($q = studip_utf8decode(Request::get("question")));
        $question->setTitle(my_substr($q, 0, 50));

        // TODO: woher weiss ich, dass das UTF8 ist?
        $choices = array_map(function ($choice) { return studip_utf8decode($choice); },
                             Request::getArray("choices"));
        $choices = Question::makeChoices($choices);
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

    // TODO: mit create_action kombinieren
    // TODO: Validation!? (eingebaut?)
    function update_action($id)
    {
        $question = $this->question;
        $dirty = false;

        // UPDATE QUESTION
        // TODO: woher weiss ich, dass das UTF8 ist?
        $q = Request::get("question");
        if (isset($q)) {
            $question->setQuestion($q = studip_utf8decode());
            $question->setTitle(my_substr($q, 0, 50));
            $dirty = true;
        }

        // UPDATE CHOICES
        // TODO zuviel in dieser action, besser nur 10 zeilen
        $choices = Request::getArray("choices");
        if (isset($choices)) {

            $answers = array();
            foreach ($question->getAnswers() as $answer) {
                $answers[$answer['answer_id']] = $answer;
            }
            $new_answers = array();
            foreach ($choices as $id => $choice) {
                if ($choice !== '') {

                    // TODO: woher weiss ich, dass das UTF8 ist?
                    $choice = studip_utf8decode($choice);

                    $new_answers[] = is_int($id)
                    ? Question::makeChoice($choice)
                    : array_merge($answers[$id], array('text' => $choice));
                }
            }
            $question->setAnswers($new_answers);
            $dirty = true;
        }

        if ($dirty) {
            $question->executeWrite();
        }
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

    const ACTIVE_TIMESPAN = 7200; //60 * 60 * 2 = 2h

    # TODO not restful
    function start_action($id)
    {
        $this->question->setStopdate(time() + self::ACTIVE_TIMESPAN);

        if ($this->question->isNew()) {
            $this->question->executeStart();
        } else {
            $this->question->executeRestart();
        }
        $error = $this->question->isError();

        if (Request::isXhr()) {
            if ($error) {
                throw new Trails_Exception(400, "Could not start");
            } else {
                $this->response->set_status(204);
                return $this->render_nothing();
            }
        }
        else {
            if ($error) {
                $this->flash['error'] = "Could not start question";
            } else {
                $this->flash['info'] = "Question started";
            }
            return $this->redirect('questions/show/' . $id);
        }
    }


    # TODO not restful
    function stop_action($id)
    {
        $this->question->executeStop();
        $error = $this->question->isError();

        if (Request::isXhr()) {
            if ($error) {
                throw new Trails_Exception(400, "Could not stop");
            } else {
                $this->response->set_status(204);
                return $this->render_nothing();
            }
        }
        else {
            if ($error) {
                $this->flash['error'] = "Could not stop question";
            } else {
                $this->flash['info'] = "Question stopped";
            }
            return $this->redirect('questions/show/' . $id);
        }
    }

    /*


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

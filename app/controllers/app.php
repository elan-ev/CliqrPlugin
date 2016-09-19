<?php

namespace Cliqr;

require_once 'cliqr_studip_controller.php';

use Cliqr\DB\Assignment;

class AppController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();

        if (\Navigation::hasItem('/course/cliqr')) {
            \Navigation::activateItem('/course/cliqr/index');
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    public function index_action()
    {
        $canEdit = $this->container['authority']->can('index', 'TaskGroup');

        $this->json = [
            'userRole' => $canEdit ? 'lecturer' : 'student',
        ];

        if ($canEdit) {
            $this->json['taskGroups'] = $this->getTaskGroupsJSON($this->cid);
        } else {
            $this->json['lastVotings'] = $this->getLastVotingsJSON($this->cid);
        }

        $this->short_url = $this->generateShortURL();
    }

    private function getTaskGroupsJSON($cid)
    {
        $taskGroups = Assignment::findTaskGroups($cid);

        return $taskGroups->toJSON();
    }

    private function getLastVotingsJSON($cid)
    {
        $lastVotings = Assignment::findVotings('course', $cid);

        return $lastVotings->toJSON();
    }

    // get poll URL and shorten it
    private function generateShortURL()
    {
        $pollsUrl = $this->polls_url($this->cid);

        return $this->plugin->config['shortener']->shorten($pollsUrl);
    }
}

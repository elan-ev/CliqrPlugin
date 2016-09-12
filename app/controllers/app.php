<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Test;

class AppController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();

        if (\Navigation::hasItem("/course/cliqr")) {
            \Navigation::activateItem("/course/cliqr/index");
        }
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function index_action() {

        $canEdit = $this->container['authority']->can('edit', 'TaskGroup');

        $this->json = [
            'userRole' =>  $canEdit ? 'lecturer' : 'student'
        ];

        if ($canEdit) {
            $this->json['taskGroups'] = $this->getTaskGroupsJSON($this->cid);
        } else {
            $this->json['lastAssignments'] = $this->getLastAssignmentsJSON($this->cid);
        }

        $this->short_url = $this->generateShortURL();
    }



    private function getTaskGroupsJSON($cid)
    {
        $taskGroups = Assignment::findTaskGroups($cid);
        return $taskGroups->toJSON();
    }

    private function getLastAssignmentsJSON($cid)
    {
        $lastAssignments = Assignment::findVotings('course', $cid);
        return $lastAssignments->toJSON();
    }

    # get poll URL and shorten it
    private function generateShortURL()
    {
        $polls_url = $this->polls_url($this->cid);
        return $this->plugin->config['shortener']->shorten($polls_url);
    }
}

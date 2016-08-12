<?php
require_once 'cliqr_controller.php';

use \Cliqr\DB\Assignment;
use \Cliqr\DB\Task;

class VotingsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = self::requireContext();
        self::requireAuthorisation($this->cid);
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    function show_action($id)
    {
        $result = null;
        if ($assignment = Assignment::findVoting($this->cid, $id)) {
            $result = $assignment->toJSON();
        }
        $this->render_json($result);
    }
}

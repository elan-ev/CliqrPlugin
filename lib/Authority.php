<?php

namespace Cliqr;

class Authority extends \Authority\Authority
{
    public function __construct($container, $currentUser, $dispatcher = null)
    {
        parent::__construct($currentUser, $dispatcher);

        $this->container = $container;

        $this->addAlias('manage', ['create', 'update', 'index', 'read', 'delete', 'export', 'import']);
        $this->addAlias('edit', ['create', 'update', 'delete']);

        // ***** TASK GROUP ****

        $this->allow('manage', 'TaskGroup', function ($self) {
            return $GLOBALS['perm']->have_studip_perm('tutor', $this->container['cid']);
        });

        // ***** TASK ****

        $this->allow('manage', 'Task', function ($self, $task) {
            // TODO: eigentlich müssen wir auch nachsehen,
            //       ob es eine TaskGroup in dieser CID gibt,
            //       die diesen Task enthält
            return $GLOBALS['perm']->have_studip_perm('tutor', $this->container['cid']);
        });

        // ***** VOTING ****

        $this->allow('edit', 'Voting', function ($self, $assignment) {
            $cid = $assignment ? $assignment->range_id : $this->container['cid'];

            return $GLOBALS['perm']->have_studip_perm('tutor', $cid);
        });

        $this->allow('read', 'Voting', function ($self, $assignment) {
            $cid = $assignment ? $assignment->range_id : $this->container['cid'];

            $isAtLeastAutor = $GLOBALS['perm']->have_studip_perm('autor', $cid);
            $isAtLeastTutor = $GLOBALS['perm']->have_studip_perm('tutor', $cid);
            $isAutor = $isAtLeastAutor && !$isAtLeastTutor;

            if (!$isAtLeastAutor) {
                return false;
            }

            if (!$assignment) {
                return $isAtLeastAutor;
            }

            return $isAtLeastTutor || !$assignment->isRunning();
        });

        // ***** RESPONSE ****
        $this->allow('create', 'Response', function ($self) {
            return $GLOBALS['perm']->have_studip_perm('autor', $this->container['cid']);
        });
    }
}

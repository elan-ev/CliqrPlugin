<?php

namespace Cliqr;

require_once 'cliqr_studip_controller.php';

use Cliqr\DB\Assignment;

/**
 * @property string $cid
 * @property string $short_url
 * @property array  $json
 */
class AppController extends CliqrStudipController
{
    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     */
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = $this->requireContext();


        if (!\Request::isXhr()) {
            $GLOBALS['CURRENT_PAGE'] = 'Cliqr';

            \PageLayout::setTitle($this->container['header_line'].' - '._('Cliqr'));
        }

        $label = 'Wozu ist "Stud.IP Cliqr" gut?';
        $text = <<<'HELPTEXT'
Mit Cliqr können Lehrende in einer Veranstaltung online Fragen stellen und die Lernenden damit aktiv in die Veranstaltung einbeziehen. Die gestellten Frage werden mit Hilfe der mobilen Endgeräten der Studierenden beantwortet.
HELPTEXT;
        \Helpbar::get()->addPlainText($label, $text);

        \Helpbar::get()->addLink(
            'Methodische Informationen',
            \PluginEngine::getURL('cliqrplugin', [], 'help'),
            \Icon::create('folder-full', \Icon::ROLE_INFO_ALT),
            false,
            ['data-dialog' => 'size=big']
        );
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     */
    public function index_action()
    {
        $canEdit = $this->container['authority']->can('index', 'TaskGroup');

        $this->json = [
            'userRole' => $canEdit ? 'lecturer' : 'student',
        ];

        if ($canEdit) {
            $taskGroups = Assignment::findTaskGroups($this->cid);
            $this->json['taskGroups'] = $this->getTaskGroupsJSON($taskGroups);

            $this->setupLecturerNavigation($taskGroups);
        } else {
            $this->json['lastVotings'] = $this->getLastVotingsJSON($this->cid);
            $this->setupStudentNavigation();
        }

        $this->short_url = $this->generateShortURL();
    }

    private function getTaskGroupsJSON($taskGroups)
    {
        return $taskGroups->map(
            function ($tg) {
                return $tg->getTaskGroupJSON();
            }
        );
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

    /**
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     */
    protected function setupLecturerNavigation($taskGroups)
    {
        if (!\Navigation::hasItem('/course/cliqr')) {
            return;
        }

        $url = \PluginEngine::getURL('cliqrplugin', ['cid' => $this->plugin->getContext()], '', true);
        $navigation = \Navigation::getItem('/course/cliqr');
        $navigation->addSubNavigation(
            'index',
            new \Navigation('Fragensammlungen', $url.'#task-groups')
        );

        foreach ($taskGroups as $taskGroup) {
            $taskGroupNav = new \Navigation(
                $taskGroup->test->title,
                $url.'#task-groups/show/'.(int) $taskGroup->id
            );
            $taskGroupNav->setLinkAttributes(['target' => '_blank']);
            $navigation->addSubNavigation('taskgroup-'.(int) $taskGroup->id, $taskGroupNav);
        }

        $navigation->addSubNavigation(
            'archive',
            new \Navigation('Beendete Abstimmungen', $url.'#archive')
        );

        \Navigation::activateItem('/course/cliqr/index');

        \NotificationCenter::addObserver(
            function ($event, $sidebar) {
                $navigation = $sidebar->getWidget('navigation');
                foreach ($navigation->getElements() as $element) {
                    if (preg_match('/cliqr_taskgroup/', $element->attributes['id'])) {
                        $element->attributes['class'] = 'cliqr--navigation-task-group';
                    }
                }
            },
            '__invoke',
            'SidebarWillRender'
        );
    }

    protected function setupStudentNavigation()
    {
        if (!\Navigation::hasItem('/course/cliqr')) {
            return;
        }

        $url = \PluginEngine::getURL('cliqrplugin', ['cid' => $this->plugin->getContext()], '', true);
        \Navigation::getItem('/course/cliqr')->addSubNavigation(
            'archive',
            new \Navigation('Beendete Abstimmungen', $url.'#archive')
        );
        \Navigation::activateItem('/course/cliqr/archive');
    }
}

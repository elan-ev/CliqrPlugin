<?php

namespace Cliqr;

use Cliqr\DB\Assignment;
use Cliqr\DB\Test;

require_once 'cliqr_studip_controller.php';

class TaskGroupsController extends CliqrStudipController
{
    public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);

        $this->cid = $this->requireContext();
    }

    /***************************************************************************/
    /* ACTIONS                                                                 */
    /***************************************************************************/

    public function index_action()
    {
        if (!$this->can('index', 'TaskGroup')) {
            throw new \Trails_Exception(403);
        }

        $taskGroups = Assignment::findTaskGroups($this->cid);
        $this->render_json($taskGroups->toJSON());
    }

    public function show_action($id)
    {
        $taskGroup = Assignment::findTaskGroup($this->cid, $id);

        if (!$this->can('read', 'TaskGroup', $taskGroup)) {
            throw new \Trails_Exception(403);
        }

        if (!$taskGroup) {
            throw new \Cliqr\RecordNotFound();
        }

        $this->render_json($taskGroup->toJSON());
    }

    public function create_action()
    {
        if (!$this->can('create', 'TaskGroup')) {
            throw new \Trails_Exception(403);
        }

        if (!$this->hasJSONContentType()) {
            throw new \Trails_Exception(400, 'TODO: has to be JSON');
        }
        $json = $this->parseJSONBody();

        if (!array_key_exists('title', $json)) {
            throw new \Trails_Exception(400, 'TODO: title required');
        }

        $taskGroup = Assignment::createTaskGroup('course', $this->cid, $json);
        $this->render_json($taskGroup->toJSON());
    }

    public function update_action($id)
    {
        $taskGroup = Assignment::findTaskGroup($this->cid, $id);

        if (!$this->can('update', 'TaskGroup', $taskGroup)) {
            throw new \Trails_Exception(403);
        }

        if (!$taskGroup) {
            throw new \Cliqr\RecordNotFound();
        }

        if (!$this->hasJSONContentType()) {
            throw new \Trails_Exception(400, 'TODO: has to be JSON');
        }
        $json = $this->parseJSONBody();

        if (!array_key_exists('title', $json)) {
            throw new \Trails_Exception(400, 'TODO: title required');
        }

        $test = $taskGroup->test;
        $test->title = $json['title'];
        $test->store();

        $this->render_json($taskGroup->toJSON());
    }


    public function destroy_action($id)
    {
        $taskGroup = Assignment::findTaskGroup($this->cid, $id);

        if (!$this->can('delete', 'TaskGroup', $taskGroup)) {
            throw new \Trails_Exception(403);
        }

        if (!$taskGroup) {
            throw new \Cliqr\RecordNotFound();
        }

        $test = $taskGroup->test;
        $tasks = $test->tasks;

        foreach ($tasks as $task) {
            foreach ($task->getVotings() as $voting) {
                $voting->test->delete();
            }
            $task->delete();
        }

        $test->delete();

        $this->render_json(['status' => 'OK']);
    }

    public function export_action($id)
    {
        $taskGroup = Assignment::findTaskGroup($this->cid, $id);

        if (!$this->can('export', 'TaskGroup', $taskGroup)) {
            throw new \Trails_Exception(403);
        }

        if (!$taskGroup) {
            throw new \Cliqr\RecordNotFound();
        }

        $exporter = new \Cliqr\Exporter();

        $exportString = $exporter->exportTaskGroup($taskGroup);

        if ($_SERVER['HTTPS'] === 'on') {
            $this->response->add_header('Pragma', 'public');
            $this->response->add_header('Cache-Control', 'private');
        } else {
            $this->response->add_header('Pragma', 'no-cache');
            $this->response->add_header('Cache-Control', 'no-store, no-cache, must-revalidate');
        }

        $this->response->add_header('Content-Disposition', 'attachment;filename="task-group-1.json"');
        $this->response->add_header('Content-Description', 'File Transfer');
        $this->response->add_header('Content-Transfer-Encoding', 'binary');
        $this->response->add_header('Content-Type', 'application/json;charset=utf-8');
        $this->response->add_header('Content-Length', strlen($exportString));

        $this->render_text($exportString);
    }

    public function import_action()
    {
        if (!$this->can('import', 'TaskGroup')) {
            throw new \Trails_Exception(403);
        }

        if (empty($_FILES) || !isset($_FILES['task-group-import-file'])) {
            throw new \Trails_Exception(400);
        }

        if (!is_uploaded_file($tmpname = $_FILES['task-group-import-file']['tmp_name'])) {
            throw new \Trails_Exception(400, 'Datei wurde fehlerhaft hochgeladen:');
        }

        if ($error = $_FILES['task-group-import-file']['error']) {
            throw new \Trails_Exception(400, 'Datei wurde fehlerhaft hochgeladen:');
        }

        $importer = new \Cliqr\Importer('course', $this->cid);
        $importer->importString(file_get_contents($tmpname));

        $this->redirect('');
    }

    public function duplicate_action($id)
    {
        $taskGroup = Assignment::findTaskGroup($this->cid, $id);

        if (!$this->can('create', 'TaskGroup', $taskGroup)) {
            throw new \Trails_Exception(403);
        }

        if (!$taskGroup) {
            throw new \Cliqr\RecordNotFound();
        }

        $duplicate = $taskGroup->duplicateTaskGroup();

        $this->redirect('task_groups/show/'.$duplicate->id);
    }
}

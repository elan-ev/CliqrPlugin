<?php

namespace Cliqr\DB;

class Test extends \eTask\Test
{
    use ConfigureTrait;
    use CreatedChangedTrait;

    public function getLastChange()
    {
        $changed = new \DateTime($this->changed);

        $sql = "SELECT MAX(ta.changed) as max FROM `etask_test_tasks` tt
                 LEFT JOIN etask_tasks ta ON tt.task_id = ta.id
                 WHERE tt.test_id = ?";
        $stmt = \DBManager::get()->prepare($sql);
        $stmt->execute([ $this->id ]);

        if (!$max = $stmt->fetchColumn()) {
            return $changed;
        }

        return max(\DateTime::createFromFormat('Y-m-d H:i:s', $max), $changed);
    }

    public function getTaskIds()
    {
        $stmt = \DBManager::get()->prepare("SELECT task_id FROM `etask_test_tasks` WHERE `test_id` = ?");
        $stmt->execute([ $this->id ]);
        $ids = array_map('intval', $stmt->fetchAll(\PDO::FETCH_COLUMN));
        return $ids;
    }

    public function toJSON($omits = [])
    {
        $result = $this->toArray('id title created changed');
        $result['tasks'] = $this->tasks->toJSON($omits);

        return $result;
    }
}

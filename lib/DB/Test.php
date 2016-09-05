<?php
namespace Cliqr\DB;

class Test extends \eAufgaben\DB\Test
{
    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray('id title created changed');
        $result['tasks'] = $this->tasks->toJSON();
        return $result;
    }
}

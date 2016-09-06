<?php
namespace Cliqr\DB;

class Test extends \eAufgaben\DB\Test
{
    public function belongsToAVoting()
    {
        return isset($this->options['voting']) && $this->options['voting'] == 1;
    }

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray('id title created changed');
        $result['tasks'] = $this->tasks->toJSON();
        return $result;
    }
}

<?php

namespace Cliqr\DB;

class Test extends \eAufgaben\Test
{
    use ConfigureTrait;

    public function toJSON($omits = [])
    {
        $result = $this->toArray('id title created changed');
        $result['tasks'] = $this->tasks->toJSON($omits);

        return $result;
    }
}

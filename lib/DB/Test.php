<?php

namespace Cliqr\DB;

class Test extends \eTask\Test
{
    use ConfigureTrait;
    use CreatedChangedTrait;

    public function toJSON($omits = [])
    {
        $result = $this->toArray('id title created changed');
        $result['tasks'] = $this->tasks->toJSON($omits);

        return $result;
    }
}

<?php

namespace Cliqr\DB;

class AssignmentRange extends \etask\AssignmentRange
{
    use ConfigureTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

<?php

namespace Cliqr\DB;

use eTask\AssignmentRange as eAssignmentRange;

class AssignmentRange extends eAssignmentRange
{
    use ConfigureTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

<?php

namespace Cliqr\DB;

class Attempt extends \eAufgaben\DB\Attempt
{
    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

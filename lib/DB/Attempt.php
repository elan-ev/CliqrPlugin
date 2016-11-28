<?php

namespace Cliqr\DB;

class Attempt extends \eAufgaben\Attempt
{
    use ConfigureTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

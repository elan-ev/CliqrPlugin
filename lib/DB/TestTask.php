<?php

namespace Cliqr\DB;

class TestTask extends \eAufgaben\TestTask
{
    use ConfigureTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

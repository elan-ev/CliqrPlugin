<?php
namespace Cliqr\DB;

class TestTask extends \eAufgaben\DB\TestTask
{
    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();
        return $result;
    }
}

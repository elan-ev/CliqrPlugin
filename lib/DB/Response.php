<?php
namespace Cliqr\DB;

class Response extends \eAufgaben\DB\Response
{
    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();
        return $result;
    }
}

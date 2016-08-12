<?php
namespace Cliqr\DB;

class Response extends \eAufgaben\DB\Response
{
    public function toJSON()
    {
        $result = $this->toArray();
        return $result;
    }
}

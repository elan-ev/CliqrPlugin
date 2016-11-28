<?php

namespace Cliqr\DB;

class Response extends \eAufgaben\Response
{
    use ConfigureTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

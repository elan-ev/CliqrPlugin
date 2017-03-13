<?php

namespace Cliqr\DB;

class Attempt extends \eTask\Attempt
{
    use ConfigureTrait;
    use CreatedChangedTrait;

    public function toJSON($include = '')
    {
        $include = words($include);

        $result = $this->toArray();

        return $result;
    }
}

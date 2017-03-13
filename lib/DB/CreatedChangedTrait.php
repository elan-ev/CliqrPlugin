<?php
namespace Cliqr\DB;

/**
 * Reformats timestamps ISO 8601 compliant
 */
trait CreatedChangedTrait
{
    public function getCreated()
    {
        return date('c', strtotime($this->content['created']));
    }

    public function getChanged()
    {
        return date('c', strtotime($this->content['changed']));
    }
}

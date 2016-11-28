<?php
namespace Cliqr\DB;

/**
 * eAufgaben TODO
 */
trait ConfigureTrait
{
    protected static function configure($config = array())
    {
        $config['relationTypes'] = [
            'Assignment' => '\\Cliqr\\DB\\Assignment',
            'Attempt'    => '\\Cliqr\\DB\\Attempt',
            'Response'   => '\\Cliqr\\DB\\Response',
            'Task'       => '\\Cliqr\\DB\\Task',
            'Test'       => '\\Cliqr\\DB\\Test',
            'TestTask'   => '\\Cliqr\\DB\\TestTask'
        ];

        parent::configure($config);
    }
}

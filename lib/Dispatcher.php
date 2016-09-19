<?php

namespace Cliqr;

class Dispatcher extends \Trails_Dispatcher
{

    const CONTROLLER_NAMESPACE = '\\Cliqr\\';

    /**
     * Loads the controller file for a given controller path and return an
     * instance of that controller. If an error occures, an exception will be
     * thrown.
     *
     * @param  string            the relative controller path
     *
     * @return TrailsController  an instance of that controller
     */
    function load_controller($controller)
    {
        require_once "{$this->trails_root}/controllers/{$controller}.php";
            $class = self::CONTROLLER_NAMESPACE . \Trails_Inflector::camelize($controller) . 'Controller';
        if (!class_exists($class)) {
            throw new \Trails_UnknownController("Controller missing: '$class'");
        }
        return new $class($this);
    }
}

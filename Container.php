<?php

namespace Cliqr;

require_once 'lib/Pimple.php';

class Container extends \Pimple {

    function __construct()
    {
        /*
        $this['shortener_file']  = 'lib/MockShortener.php';
        $this['shortener_class'] = '\\Cliqr\\MockShortener';
        */

        $this['shortener_file']  = 'lib/GoogleShortener.php';
        $this['shortener_class'] = '\\Cliqr\\GoogleShortener';

        $this['shortener'] = $this->share(
            function ($c) {
                require_once dirname(__FILE__) . "/" . $c['shortener_file'];
                $class = $c['shortener_class'];
                return new $class();
            }
        );
    }
}

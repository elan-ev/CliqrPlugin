<?php

namespace Cliqr;

class Container extends \Pimple {

    function __construct()
    {

        $base_path = dirname(dirname(__FILE__)) . '/';

        $ini = array();

        $this['ini'] = parse_ini_file($base_path . 'config.php', true, INI_SCANNER_RAW);


        $this['shortener'] = $this->share(
            function ($c) use ($base_path) {
                require_once $base_path . $c['ini']['shortener']['file'];
                $class = $c['ini']['shortener']['class'];
                return new $class($c);
            }
        );

        //$this['pusher_debug'] = true;
        //$this['pusher_host'] = 'localhost';
        //$this['pusher_port'] = '4567';

        $this['pusher'] = $this->share(
            function ($c) {
                //$pusher = new Pusher($c['pusher_key'], $c['pusher_secret'], $c['pusher_app_id'], $debug, $host, $port);
                $pusher = new \Pusher($c['ini']['pusher']['key'],
                                      $c['ini']['pusher']['secret'],
                                      $c['ini']['pusher']['app_id']);
                return $pusher;
            }
        );

        $this['pusher_channel'] = function ($c) {
            return function ($range_id) { return "cliqr_" . $range_id;  };
        };
    }
}

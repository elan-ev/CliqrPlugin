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

        /*
        $this['logger'] = $this->share(
            function ($c) {
                $log = new \Monolog\Logger('name');
                $log->pushHandler(new \Monolog\Handler\StreamHandler('/tmp/your.log'));
                return $log;
            });
        */

        $this['pusher_configured'] = function ($c) {
            return isset($c['ini']['pusher']['key']);
        };

        $this['pusher'] = $this->share(
            function ($c) {

                # no pusher w/o config
                if ($c['pusher_configured'] == false) {
                    return null;
                }

                if (isset($c['ini']['pusher']['host']) && isset($c['ini']['pusher']['api_port'])) {
                    $pusher = new \Pusher($c['ini']['pusher']['key'],
                                          $c['ini']['pusher']['secret'],
                                          $c['ini']['pusher']['app_id'],
                                          true,
                                          $c['ini']['pusher']['host'],
                                          $c['ini']['pusher']['api_port']);

                }
                else {
                    $pusher = new \Pusher($c['ini']['pusher']['key'],
                                          $c['ini']['pusher']['secret'],
                                          $c['ini']['pusher']['app_id']);
                                          // 'http://api.pusherapp.com',
                                          // '80'
                }
                //$pusher->set_logger($c['logger']);
                return $pusher;
            }
        );

        $this['pusher_channel'] = function ($c) {
            return function ($range_id) { return "cliqr_" . $range_id;  };
        };
    }
}

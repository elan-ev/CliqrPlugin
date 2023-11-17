<?php

namespace Cliqr;

require_once 'Shortener.php';

class PolrShortener implements Shortener
{
    private $config;

    public function __construct($container)
    {
        $this->config = $container['ini']['polr'];
    }

    /**
     * Shortens a URL.
     *
     * Wrapper around the actual #performRequest memorizing its
     * results to prevent calling Polr on each invocation.
     *
     * @param string $url URL to be shortened
     * @return string shortened URL or null if anything went wrong
     */
    public function shorten($url)
    {
        $cache = \StudipCacheFactory::getCache();
        $cache_key = 'cliqr/polr/'.md5($url);

        $result = $cache->read($cache_key);
        if ($result === false) {
            $result = $this->performRequest($url);
            $cache->write($cache_key, $result);
        }

        return $result;
    }

    /**
     * Performs the actual shorten request against the Polr server.
     *
     * @param string $url URL to be shortened
     * @return string shortened URL or null if anything went wrong
     */
    private function performRequest($url)
    {
        $api_endpoint = $this->config['api_url'].'/action/shorten';

        $data = [
            'key'           => $this->config['api_key'],
            'url'           => $url,
            'response_type' => 'plain_text',
        ];

        $ch = \curl_init($api_endpoint);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response ?: null;
    }
}

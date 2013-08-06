<?php

// Copyright (c) 2012 - <mlunzena@uos.de>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

namespace Cliqr;

require_once 'Shortener.php';

class GoogleShortener implements Shortener {

    function __construct($container)
    {
        $this->config = $container['ini']['google'];
    }

    public function shorten($url)
    {
        $response = $this->performRequest($url, true);
        return $response->id;
    }

    public function expand($url)
    {
        $response = $this->performRequest($url, false);
        return $response->longUrl;
    }


    /**
     * Wrapper around the actual #_performRequest memoizing its
     * results to prevent calling Google on each invocation.
     */
    private function performRequest($url, $shorten)
    {
        $cache = \StudipCacheFactory::getCache();
        $cache_key = 'cliqr/google/' . md5($url) . '/' . (int)$shorten;

        $result = unserialize($cache->read($cache_key));
        if ($result === false) {
            $result = $this->_performRequest($url, $shorten);
            $cache->write($cache_key, serialize($result));
        }

        return $result;
    }

    private function _performRequest($url, $shorten)
    {
        $apiUrl = $this->config['api_url'] . '?' . $this->config['api_key'];

        if (!$shorten) {
            $apiUrl .= "&shortUrl=$url";
        }

        $ch = \curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if ($shorten) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER,
                        array("Content-Type: application/json"));
            curl_setopt($ch, CURLOPT_POSTFIELDS,
                        json_encode(array("longUrl" => $url)));
        }

        return json_decode(curl_exec($ch));
    }
}

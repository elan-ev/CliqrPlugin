<?php

// Copyright (c) 2013 - <mlunzena@uos.de>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

namespace Cliqr;

require_once 'Shortener.php';

class BasicShortener implements Shortener
{
    public function __construct($container)
    {
        $this->config = $container['ini']['basicshortener'];
    }

    public function shorten($url)
    {
        $response = $this->performRequest($url);

        return $response;
    }

    /**
     * Wrapper around the actual #_performRequest memoizing its
     * results to prevent calling the shortener service on each invocation.
     */
    private function performRequest($url)
    {
        $cache = \StudipCacheFactory::getCache();
        $cache_key = 'cliqr/basicshortener/'.md5($url);

        $result = unserialize($cache->read($cache_key));
        if (true || $result === false) {
            $result = $this->_performRequest($url);
            $cache->write($cache_key, serialize($result));
        }

        return $result;
    }

    private function _performRequest($url)
    {
        $apiUrl = sprintf($this->config['url'], urlencode($url));

        $ch = \curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        return curl_exec($ch);
    }
}

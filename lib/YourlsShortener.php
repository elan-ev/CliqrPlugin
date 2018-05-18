<?php
/**
 * Shortener class for yourls.
 *
 * @author  Jan-Hendrik Willms <tleilax+studip@gmail.com>
 * @license GPL2 or any later version
 * @see https://yourls.org/
 */

namespace Cliqr;

use Exception;
use StudipCacheFactory;

require_once __DIR__ . '/Shortener.php';

class YourlsShortener implements Shortener
{
    private $config;

    public function __construct($config)
    {
        $configuration = $this->sanitizeConfig($config['ini']['yourls']);

        $this->validateConfig($configuration);

        $this->config = $configuration;
    }

    /**
     * Sanitizes the provided configuration.
     *
     * @param array $config
     * @return array
     */
    private function sanitizeConfig(array $config)
    {
        return array_map('trim', $config);
    }

    /**
     * Validates the provided configuration and throws an exception if anything
     * is not valid.
     *
     * @param array $config
     * @throws Exception when anything is missing or incorrect
     */
    private function validateConfig(array $config)
    {
        $errors = [];

        if (empty($config['endpoint'])) {
            $errors[] = 'API endpoint is not set';
        } elseif (!filter_var($config['endpoint'], FILTER_VALIDATE_URL)) {
            $errors[] = 'API endpoint is not a valid url';
        }

        if (!$config['api_key'] && (!$config['username'] || !$config['password'])) {
            $errors[] = 'No credentials provided (no username/password and no api_key)';
        }

        if (count($errors) > 0) {
            throw new Exception('Provided yourls config is invalid: ' . implode(', ', $errors));
        }
    }

    /**
     * Shortens a URL.
     *
     * Wrapper around the actual #performRequest memoizing its
     * results to prevent calling Google on each invocation.
     *
     * @param string $url URL to be shortened
     * @return string shortened URL or null if anything went wrong
     */
    public function shorten($url)
    {
        $cache = StudipCacheFactory::getCache();
        $cache_key = 'cliqr/yourls/'.md5($url);

        $result = $cache->read($cache_key);
        if ($result === false) {
            $result = $this->performRequest($url);
            $cache->write($cache_key, $result);
        }

        return $result;
    }

    /**
     * Performs the actual shorten request against the yourls server.
     *
     * @param string $url URL to be shortened
     * @return string shortened URL or null if anything went wrong
     */
    private function performRequest($url)
    {
        $data = [
            'url'    => $url,
            'action' => 'shorturl',
            'format' => 'simple',
        ];

        if ($this->config['api_key']) {
            $data['timestamp'] = time();
            $data['signature'] = md5($data['timestamp'] . trim($this->config['api_key']));
        } else {
            $data['username'] = $this->config['username'];
            $data['password'] = $this->config['password'];
        }

        $ch = curl_init($this->config['endpoint']);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response ?: null;
    }
}

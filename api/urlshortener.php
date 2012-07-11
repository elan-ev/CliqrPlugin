<?php
class UrlShortener
{
    /**
     * URL to the URL shortener API
     * @var string
     */
    private $apiURL = "https://www.googleapis.com/urlshortener/v1/url";
    
    /**
     * the key for authenticating to the URL shortener API
     * @var string
     */
    private $apiKey;
  
    public function __construct($key)
    {
        $this->apiKey = $key;
    }
    
    /**
     * shortens a URL
     * 
     * @param string $url URL to be shortened
     * @return string shortened URL or null if anything went wrong
     */
    public function shorten($url)
    {
        $response = $this->performRequest($url, true);
        return $response->id;
    }

    /**
     * expands a shortened URL
     * 
     * @param string $url short URL to be expanded
     * @return string expanded URL or null if anything went wrong
     */
    public function expand($url)
    {
        $response = $this->performRequest($url, false);
        return $response->longUrl;
    }
    
    /**
     * performs the request and returns the decoded JSON response
     * 
     * @return stdClass 
     */
    private function performRequest($url, $shorten)
    {
        if(strpos($this->apiURL, "?") === false) {
            $apiUrl = "{$this->apiURL}?{$this->apiKey}";
        } else {
            $apiUrl = "{$this->apiURL}&{$this->apiKey}";
        }
        
        if(!$shorten) {
            $apiUrl .= "&shortUrl=$url";
        }
        
        $ch = curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        if($shorten) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER,
                    array("Content-Type: application/json"));
            curl_setopt($ch, CURLOPT_POSTFIELDS,
                    json_encode(array("longUrl" => $url)));
        }
        
        return json_decode(curl_exec($ch));
    }
}
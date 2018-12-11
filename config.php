; <?php die(); __halt_compiler();
;
; Cliqr configuration file
; (note the first line. php opener/die included to prevent dumping settings to browser)
;

[shortener]
; COMMENT these and UNCOMMENT the second set to use Google's urlshortener
file = lib/BasicShortener.php
class = \Cliqr\BasicShortener

;file = lib/MockShortener.php
;class = \Cliqr\MockShortener

;file = lib/GoogleShortener.php
;class = \Cliqr\GoogleShortener

;file = lib/YourlsShortener.php
;class = \Cliqr\YourlsShortener

[basicshortener]
url = https://vt.uos.de/shorten.php?longurl=%s

[google]
;api_url = https://www.googleapis.com/urlshortener/v1/url
; INSERT your google api key here, see:
;   https://developers.google.com/url-shortener/v1/getting_started#APIKey
;api_key = <MY-GOOGLE-KEY>

[yourls]
endpoint = https://<yourls-domain>/yourls-api.php
;use either username and password or provide an api key
username =
password =
api_key =

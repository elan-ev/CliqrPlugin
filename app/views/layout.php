<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

$ASSETS = $plugin->getPluginURL() . '/assets/';
PageLayout::addStylesheet($ASSETS . 'questions/styles.css');
PageLayout::addScript($ASSETS . 'vendor/jquery.isotope.min.js');
PageLayout::addScript($ASSETS . 'vendor/validator.js');

$short_url = $plugin->config['shortener']->shorten($controller->poll_url($cid));

PageLayout::addHeadElement('script', array(),
'
var cliqr = {bootstrap: {}, config: {
    PLUGIN_URL : "' . htmlReady(current(explode('?', $controller->url_for("")))) . '"
  , CID        : "' . htmlReady($cid) . '"
  , ASSETS     : "' . htmlReady($ASSETS) . '"
  , SHORT_URL  : "' . htmlReady($short_url) . '"
}};
');
?>

<!-- BEGIN CLIQR PAGE -->
<?= $content_for_layout ?>
<!-- END CLIQR PAGE -->

<?= $this->render_partial('hbs/_include_js_templates', array('prefix' => 'questions-')) ?>

<script data-main="<?= $ASSETS ?>js/require/questions.js"
        src="<?= $ASSETS ?>js/vendor/require.js"></script>

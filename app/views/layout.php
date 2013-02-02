<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

class SelfDestroyingMessageBox extends MessageBox {
    public static function info($message, $details = array(), $close_details = false)
    {
        return new MessageBox('info self-destroy', $message, $details, $close_details);
    }

}

if ($flash['error']) {
    echo MessageBox::error('Fehler', array($flash["error"]));
}
if ($flash['info']) {
    echo SelfDestroyingMessageBox::info($flash["info"]);
}

?>
<div class="page">
<?= $content_for_layout ?>
</div>

<?

echo $this->render_partial('mustaches/_include_js_templates', array('prefix' => 'questions-'));

$plugin_url = $plugin->getPluginURL();
$assets = $plugin_url . '/assets/';

PageLayout::addStylesheet($assets . 'questions/styles.css');

PageLayout::addScript($assets . 'vendor/jquery.isotope.min.js');
PageLayout::addScript($assets . 'vendor/validator.js');

# TODO deprecate this
PageLayout::addScript($assets . 'questions/script.js');


$PLUGIN_URL = htmlReady(current(explode('?', $controller->url_for(""))));
PageLayout::addHeadElement('script', array(), '
// TODO refine this
var cliqr = {config: {}, model: {}};
cliqr.config.PLUGIN_URL = "' . htmlReady($PLUGIN_URL) . '";
cliqr.config.CID        = "' . htmlReady($cid) . '";
');

echo Assets::script($assets . 'js/vendor/require.js');

?>
<script>


// Configure the AMD module loader
requirejs.config({
  // The path where your JavaScripts are located
  baseUrl: '<?= $assets ?>js/',
  // Specify the paths of vendor libraries
  paths: {
      // jquery:     'vendor/jquery-1.8.2',
      underscore: 'vendor/underscore-1.4.2',
      backbone:   'vendor/backbone-0.9.2',
      mustache:   'vendor/mustache',
  },
  // Underscore and Backbone are not AMD-capable per default,
  // so we need to use the AMD wrapping of RequireJS
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    },
  }
  // For easier development, disable browser caching
  // Of course, this should be removed in a production environment
  //, urlArgs: 'bust=' +  (new Date()).getTime()
});

// Bootstrap the application
require(['questions_app'], function (QuestionsApp) {
  var app = new QuestionsApp();
  app.initialize();
});
</script>

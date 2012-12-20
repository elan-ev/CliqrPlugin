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

echo $content_for_layout;

echo $this->render_partial('mustaches/_include_js_templates', array('prefix' => 'questions-'));

$plugin_url = $plugin->getPluginURL();

PageLayout::addStylesheet($plugin_url . '/assets/styles.css');

PageLayout::addScript($plugin_url . '/assets/vendor/validator.js');
PageLayout::addScript($plugin_url . '/assets/vendor/mustache.js');
PageLayout::addScript($plugin_url . '/assets/vendor/underscore.js');
PageLayout::addScript($plugin_url . '/assets/vendor/backbone.js');


PageLayout::addScript($plugin_url . '/assets/bootstrap.js');

$PLUGIN_URL = htmlReady(current(explode('?', $controller->url_for(""))));
PageLayout::addHeadElement('script', array(), '
cliqr.config.PLUGIN_URL = "' . htmlReady($PLUGIN_URL) . '";
cliqr.config.CID        = "' . htmlReady($cid) . '";
');


PageLayout::addScript($plugin_url . '/assets/cliqr.js');

# TODO deprecate this
PageLayout::addScript($plugin_url . '/assets/script.js');

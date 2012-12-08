<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));
?>

<?
if ($flash['error']) {
    echo MessageBox::error('Fehler', array($flash["error"]));
}
if ($flash['info']) {
    echo MessageBox::info($flash["info"]);
}
?>

<?= $content_for_layout ?>

<?
global $template_factory;
$this->set_layout($template_factory->open('layouts/base'));
?>

<?
if ($flash['error']) {
    echo MessageBox::error('Fehler', array($flash["error"]));
}
?>

<?= $content_for_layout ?>

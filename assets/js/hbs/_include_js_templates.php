<? foreach (glob($this->_factory->get_path() . "hbs/". ($prefix ?: '') ."*.hbs") as $template) { ?>
<script id="cliqr-template-<?= htmlReady(current(explode(".", basename($template))))?>" type="text/html">
<? include $template ?>
</script>
<? } ?>

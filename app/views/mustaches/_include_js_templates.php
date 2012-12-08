<? foreach (glob($this->_factory->get_path() . "mustaches/". ($prefix ?: '') ."*.mustache") as $template) { ?>
<script id="cliqr-template-<?= htmlReady(current(explode(".", basename($template))))?>" type="text/html">
<? include $template ?>
</script>
<? } ?>

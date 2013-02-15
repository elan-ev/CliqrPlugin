<? $body_id = "cliqr-index"; ?>
<script>
cliqr.config.POLLS = <?= json_encode(array_map(function ($q) { return $q->toJSON(); }, $questions)) ?>;
</script>

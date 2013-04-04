<script>
cliqr.bootstrap.POLLS = <?= json_encode(array_map(function ($q) { return $q->toJSON(); }, $questions)) ?>;
</script>

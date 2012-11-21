<div class="choice-input">
  <input
     class="choice" maxlength="100" type="text"
     name="choices[<?= $answer_id ? htmlReady($answer_id) : '' ?>]"
     value="<?= $text ? htmlReady($text) : '' ?>" required>
  <a class="close">×</a>
</div>
<?
/*
  'answer_id'
  'text'
  'counter'
  'correct'
*/
?>

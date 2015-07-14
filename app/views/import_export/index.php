<h2>Import & Export</h2>

<?php 
 if(isset($message))
 {
	echo '<div style="background-color:green;padding:10px;color:white;">' . $message . '</div>'; 
 }
 
 if(isset($error))
 {
	echo '<div style="background-color:red;padding:10px;color:white;">' . $error . '</div>'; 
 }
?>

<div id="main" style="border:0">
	Was möchten Sie tun ?
	<p>
		<a class="button" id="btn_import" href="#">Importieren</a><br>
		<a class="button" id="btn_export" href="#">Exportieren</a>
		<form method="post">
			<input type="hidden" name="action_type" value="delete_all" />
			<button type="submit" id="btn_delete_all" class="button">		
				Alle Fragen Löschen
			</button>
		</form>
	</p>
</div>
<!-- Import Panel -->
<div id="import" style="display:none">
	<p>
		<h3>
			Bitte wählen Sie die Datei aus, die Sie importieren möchten.
		</h3>
	</p>
	
	<form method="post" id="frm_import"  enctype="multipart/form-data">
		<input type="hidden" name="action_type" value="import" />
		<table style="border:1px #d1d2d3 solid" cellpadding="5" cellspacing="5">		
			<tr>
				<td>
					<input type="file" name="import_file" id="import_file" />
				</td>
				<td>
					<button type="submit" class="button">		
						Importieren
					</button>	
				</td>
			</tr>		
		</table>		
	</form>
</div>
<!-- /Import Panel -->

<!-- Export Panel -->
<div id="export" style="display:none">
	<p>
		<h3>
			Bitte wählen Sie die Fragen aus, die Sie exportieren möchten.
		</h3>
	</p>

	<p>
		<input type="checkbox" id="alles" />
		<label for="alles" style="cursor:pointer">Alles auswählen</label><br><br>
	</p>
	
	<form method="post" id="frm_exports">
		<button type="submit" class="button">		
			Exportieren
		</button>
		<table id="tbl" style="border:1px #d1d2d3 solid" cellpadding="5" cellspacing="5">
		<thead>
		<tr>
			<th>#</th>
			<th>Frage</th>
		</tr>
		</thead>
		<tbody>
		<?php 

		foreach($questions as $q)
		{
			echo '<tr>';
			echo '<td valign="top"><input type="checkbox" value="' . $q->objectID .  '" id="' . $q->objectID . '" /></td>';
			echo '<td><label for="' . $q->objectID . '" style="cursor:pointer;font-size:14px"><b>' . $q->question . '</b></label>';
			
			echo '<ul>';
			foreach($q->answerArray as $a)
			{
				
				echo '<li>' . $a['text'] . '</li>';
			}
			echo '</ul>';
			
			echo '</td>';
			echo '</tr>';
				
		}

		?>
		</tbody>
		</table>
		<p>	
			<input type="hidden" name="action_type" value="export" />
			<input type="hidden" name="selected_ids" id="selected_ids" />
			<button type="submit" class="button">		
				Exportieren
			</button>		
		</p>
	</form>
</div>
<!-- /Export Panel -->

<script>
$( "#btn_import" ).click(function() {	
	$('#main').hide();
	$('#export').hide();
	$('#import').fadeIn();
});

$( "#btn_export" ).click(function() {	
	$('#main').hide();
	$('#import').hide();
	$('#export').fadeIn();
});

$( "#alles" ).click(function() {	
	 $('#tbl input:checkbox').prop('checked', this.checked);
});

$( "#frm_exports" ).submit(function(e) {	
	var toExport = [];
	
	$('#tbl input:checkbox').each(function () {
		if(this.checked)
			toExport.push($(this).val());	   
	});
	
	if(toExport.length <= 0)
	{
		alert('Sie müssen mindestens eine Frage auswählen!');
		e.preventDefault();
	}
	else	
		$('#selected_ids').val(toExport.join(','));				
});

$( "#frm_import" ).submit(function(e) 
{	
	if($('#import_file').val() == '')
	{
		alert('Bitte wählen Sie eine Datei aus!');
		e.preventDefault();
	}	

});

$( "#btn_delete_all" ).click(function(e) {
  if(confirm( "Wollen Sie wirklich alle Fragen löschen ?" ))
	  return true;
  else
	  e.preventDefault();
});
</script>
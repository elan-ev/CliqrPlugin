<?php


global $template_factory;
$this->set_layout($template_factory->open('layouts/base_without_infobox'));

		$path = substr($_SERVER['PATH_INFO'],1); 
		
		$url = PluginEngine::getURL($path);
        $navigation = new Navigation(_('History'), $url);
		Navigation::addItem('/course/cliqr/history', $navigation);
		Navigation::activateItem('/course/cliqr/history');
		
		
		PageLayout::setTitle(_($_SESSION['SessSemName']['header_line']. " - Cliqr - History"));
	
		// Zurückbutton zur Frage einblenden
		$quest= substr($_SERVER['SCRIPT_URL'],-32);
		$back_path = "cliqrplugin/questions?cid=".$_REQUEST['cid']."#show-".$quest;
		$url = PluginEngine::getURL($back_path);
        $navigation = new Navigation(_('Zurück zur Frage'), $url);
		Navigation::addItem('/course/cliqr/Back', $navigation);

$path = explode('/', $_SERVER['PATH_INFO']);
$size = sizeof($path);
$VoteID = $path[$size - 1];

$sql = $sql = "SELECT DISTINCT votehistory.startdate FROM votehistory JOIN vote ON vote.vote_id = votehistory.vote_id ".
	   "WHERE votehistory.vote_id = ? ORDER BY votehistory.startdate";
$stmt = \DBManager::get()->prepare($sql);
$stmt->execute(array($VoteID));

$i = 0;
$max = 0;

foreach($stmt as $row){

	$sql = "SELECT question, votehistory.startdate, answer, counter FROM votehistory JOIN vote ON vote.vote_id = votehistory.vote_id ".
		   "WHERE votehistory.vote_id = ? AND votehistory.startdate = ? ORDER BY votehistory.position";
	$stmt2 = \DBManager::get()->prepare($sql);
	$stmt2->execute(array($VoteID, $row['startdate']));
	$i = $i + 1;
	$j = 0;

	foreach($stmt2 as $row2){

		$j = $j + 1;
		$question = utf8_encode($row2['question']); 
		$data[0][0] = utf8_encode($row2['question']);
		$date = date('d.m.Y - H:i:s', $row2['startdate']);
		$data[0][$i] = $date;
		$data[$j][0] = utf8_encode($row2['answer']);
		$data[$j][$i] = (int) $row2['counter'];
		if($max < (int) $row2['counter'])
			$max = (int) $row2['counter'];
	}
	$i = $i + 1;
	for($z = 0; $z < sizeof($data); $z++){
		$data[$z][$i] = 'opacity: 0.6; stroke-color: #703593; stroke-width: 4;';
	}
}

for($i = 0; $i <= $max; $i++){
	$grid[$i] = $i;
}



?>
<html>
  <head>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {

	var js_array = <?php echo json_encode($data); ?>;
	var question = <?php echo json_encode($question);?>;
	var grid = <?php echo json_encode($grid);?>;
	
	for(i=2; i<js_array[0].length; i = i+2){
		js_array[0][i] = { role: 'style' };
	}
	
	console.log(js_array);
	
  var data = google.visualization.arrayToDataTable(js_array);

  var options = {
    title: question,
    hAxis: {title: question, titleTextStyle: {color: '#703593'}},
	vAxis: {ticks: grid, gridlines: {count: 5}}
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

  chart.draw(data, options);

}
    </script>
  </head>
  <body>
	<div id="chart_div" style="width: 90%; height: 600px;"></div>
  </body>
</html>
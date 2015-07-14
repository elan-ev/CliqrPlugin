<?
/*
 * import_export.php - Import & Export Controller
 *
 * This controller has all the functions to import and export questions.
 */
 
global $sess;
require_once "lib/vote/vote.config.php";
require_once "lib/vote/Vote.class.php";
require_once 'cliqr_controller.php';

use \Cliqr\Question;

class ImportExportController extends CliqrStudipController
{
	public function before_filter(&$action, &$args)
    {
        parent::before_filter($action, $args);
		
		$this->cid = Request::option("cid"); 
    }

    function index_action()
    {		
		global $auth;
		$uid = $auth->auth["uid"];
		
		
		//check if something posted
		if(Request::method() === 'POST')
		{
			$action_type = Request::get('action_type');
			if($action_type == "delete_all")
			{
				$msg = Question::deleteAllQuestions($this->cid);
				
				$this->message = $msg;
			}
			else if($action_type == "export")
			{
				$selected_ids = Request::get('selected_ids');
				//ids are seperated with ','
				$arr_id = explode(",", $selected_ids);
						
				$arr_result = array(); //output array
								
				foreach($arr_id as $id)
				{
					$q = Question::find($id);					
					
					$q->title = studip_utf8encode($q->title);
					$q->question = studip_utf8encode($q->question);
					
					$answers = array();
					foreach($q->answerArray as $a)
					{
						$answers[] = array("text" => studip_utf8encode($a['text']), "correct" => $a['correct']);
					}
					
					$q->answerArray = $answers;
					
					//remove all unnecessary fields						
					unset($q->startdate);
					unset($q->stopdate);
					unset($q->changedate);
					unset($q->timespan);
					unset($q->creationdate);
					unset($q->isInUse);
					unset($q->voteDB);
					unset($q->errorArray);
					unset($q->state);
					unset($q->namesvisibility);
					unset($q->authorEmail);
					unset($q->authorName);
					unset($q->authorNmae);
					unset($q->visible);
					unset($q->resultvisibility);
					unset($q->objectID);
					unset($q->rangeID);
					unset($q->authorID);
					unset($q->instanceof);
					
					$arr_result[] = $q;
				}
				
				$file_name = Question::getVeranstaltungName( $this->cid ) . ' [Fragen].json';
				
				//download the json file				
				header('Content-Type: application/octet-stream;charset=UTF-8');
				header('Content-Disposition: attachment; filename='.basename($file_name));
				header('Expires: 0');
				header('Cache-Control: must-revalidate');
				header('Pragma: public');			
				
				echo json_encode($arr_result, JSON_PRETTY_PRINT  );
				exit;
			}
			elseif($action_type == "import")
			{
				//checks for errors
				if ($_FILES['import_file']['error'] == UPLOAD_ERR_OK               
					&& is_uploaded_file($_FILES['import_file']['tmp_name']))  //checks that file is uploaded
				{ 				
					$file = file_get_contents($_FILES['import_file']['tmp_name']);
															
					$exported_questions = json_decode($file);										
					
					if( count($exported_questions) <= 0)
					{
						$this->error = "Sie haben ungültige Datei hochgeladen. Bitte versuchen Sie es mit einer gültigen Datei.";
					}	
						
					foreach ($exported_questions as $q) 
					{		
						//decode umlaute  utf8_decode(htmlentities(
						foreach ($q->answerArray as $a) 
						{
							$a->text = utf8_decode($a->text);							
						}
						
						$data = array 
						(
							'author_id' => $uid,
							'range_id' => $this->cid,
							'title' => utf8_decode ($q->title),
							'question' => utf8_decode ($q->question),
							'multiplechoice' => $q->multiplechoice,
							'anonymous' => $q->anonymous,
							'changeable' => $q->changeable,
							'answers' => $q->answerArray,
							'mkdate' => time(),
							'chdate' => time()
						);												
						$r = Question::insertNewQuestion( $data );												
					}
					
					$this->message = "<b>Hervorragend!</b> Die Frage(n) wurde(n) erfolgreich importiert.";
				}
				else
				{					
					$this->error = "Sie haben ungültige Datei hochgeladen. Bitte versuchen Sie es mit einer gültigen Datei.";               
				}								
			}
		}
				
		$this->questions = Question::findAll($this->cid);
		
        global $template_factory;
        $this->set_layout($template_factory->open('layouts/base_without_infobox'));

        # set title
        $GLOBALS['CURRENT_PAGE'] = 'Cliqr';
        PageLayout::setTitle(_($_SESSION['SessSemName']['header_line']. " - Cliqr - Import & Export"));
				
        Navigation::activateItem("/course/cliqr/import_export");				
    }
}
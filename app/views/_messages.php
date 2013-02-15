<?
class SelfDestroyingMessageBox extends MessageBox {
    public static function info($message, $details = array(), $close_details = false)
    {
        return new MessageBox('info self-destroy', $message, $details, $close_details);
    }
}

if ($flash['error']) {
    echo MessageBox::error('Fehler', array($flash["error"]));
}
if ($flash['info']) {
    echo SelfDestroyingMessageBox::info($flash["info"]);
}

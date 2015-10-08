<?
$m= new Mail('utf-8'); 
  $m->From( $emailFrom ); 
  $m->To( $emailTo );   
  $m->Subject( $subject );
  $m->Body($msg,'html');
  $m->Priority(4) ;
  $m->Send();   

  ?>
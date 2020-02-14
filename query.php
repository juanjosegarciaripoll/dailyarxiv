<?php

header("Content-type: text/xml"); 

// sort post data
$postarray = array();
foreach ($_GET as $getvar => $getval){
    $postarray[] = $getvar.'='.urlencode($getval);
    }
$poststring = implode('&',$postarray);

// fetch url
$curl = curl_init("http://export.arxiv.org/api/query");
curl_setopt($curl,CURLOPT_POST,count($postarray));
curl_setopt($curl,CURLOPT_POSTFIELDS,$poststring);
curl_setopt($curl,CURLOPT_RETURNTRANSFER,TRUE);
$data = curl_exec($curl);
curl_close($curl);

// print data
print $data;

?>

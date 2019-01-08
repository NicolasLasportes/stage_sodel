<?php

Route::get('/', function() 
{
    return view('tableauCommande');
});

Route::get('/tableauCommande/{id}', function($id) 
{
    echo $id;
    return view('tableauDetailCommande');
});
 
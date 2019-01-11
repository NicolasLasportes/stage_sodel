<?php

Route::get('/', function()
{
    return view("tableauCommande");
});

Route::get('/tableauCommande', 'tableauDetailCommande@afficherDetailCommande');

//API
Route::get('/commande/{id}', 'tableauCommande@obtenirCommande');

Route::post('commandeClient/{id}', 'tableauCommande@obtenirCommandesClient');
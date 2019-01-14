<?php

Route::get('/', 'tableauCommande@afficherTableauCommandes');

Route::post('/', 'tableauCommande@redirectionDetailCommande');

Route::get('/tableauCommande/{id}', 'tableauDetailCommande@afficherDetailCommande');
//API
Route::post('/commande/{id}', 'tableauCommande@obtenirCommande');

Route::post('commandeClient/{id}', 'tableauCommande@obtenirCommandesClient');

//cette route retourne les produits d'une commande spécifié grâce au parametre {id}
Route::post('produitsDeCommande/{id}', 'tableauDetailCommande@obtenirProduixCommande');

Route::post('produit/{id}', 'tableauDetailCommande@obtenirProduit');

Route::get('stock/{id}', 'tableauDetailCommande@obtenirStockProduit');
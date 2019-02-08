<?php

//Routes affichage des pages
Route::get('/client/{id}', 'tableauCommande@afficherTableauCommandes');

Route::get('/commande/{id}', 'tableauDetailCommande@afficherDetailCommande');

Route::get('/clients/{id_representant}', 'tableauCommande@afficherTableauCommandes');

//Routes pour les lignes d'une commande
Route::post('/detailCommandeClient/{id_commande}&{id_client}', 'tableauDetailCommande@obtenirProduixCommande');

Route::post('/ajouterLigneCommande', 'tableauDetailCommande@ajouterLigneCommande');

Route::post('/supprimerLigneCommande', 'tableauDetailCommande@supprimerLigne');

Route::post('/modifierLigneCommande', 'tableauDetailCommande@modifierLigne');

Route::post('/detailClient', 'tableauCommande@detailClient');

//routes entete commande
Route::post('/obtenirClients/{cle_representant}', 'tableauCommande@obtenirListeCommandes');

Route::post('/commandesClient/{id}', 'tableauCommande@afficherCommandeClient');

Route::post('/ajouterCommande', 'tableauCommande@ajouterCommande');

Route::post('/supprimerCommande', 'tableauCommande@supprimerCommande');

Route::post('/modifierCommande', 'tableauCommande@modifierCommande');

Route::post('/detailClientModification', 'tableauCommande@detailClientModification');

Route::post('/cloturerCommande', 'tableauCommande@cloturerCommande');

Route::post('/verifierCommandeCloturer', 'tableauDetailCommande@verifierCommandeCloturer');

Route::post('/envoyer_email', 'tableauDetailCommande@envoyer_email');

//Liste produits
Route::post('/listeProduits/{dossier}', 'produits@obtenirProduits');

//Route::get('produits', 'produits@produits');
//Route::get('/send_email', 'tableauDetailCommande@send_email');
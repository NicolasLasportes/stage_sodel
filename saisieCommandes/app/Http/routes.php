<?php

Route::get('/client/{id}', 'tableauCommande@afficherTableauCommandes');

Route::get('/commande/{id}', 'tableauDetailCommande@afficherDetailCommande');

Route::post('/commandesClient/{id}', 'tableauCommande@afficherCommandeClient');

Route::post('/detailCommandeClient/{id_commande}&{id_client}', 'tableauDetailCommande@obtenirProduixCommande');

Route::post('/listeProduits/{dossier}', 'produits@obtenirProduits');

Route::post('/ajouterLigneCommande', 'tableauDetailCommande@ajouterLigneCommande');

Route::post('/supprimerLigneCommande', 'tableauDetailCommande@supprimerLigne');

Route::post('/modifierLigneCommande', 'tableauDetailCommande@modifierLigne');

Route::post('/cloturerCommande', 'tableauCommande@cloturerCommande');

//routes entete commande
Route::post('/ajouterCommande', 'tableauCommande@ajouterCommande');

Route::post('/supprimerCommande', 'tableauCommande@supprimerCommande');

Route::post('/modifierCommande', 'tableauCommande@modifierCommande');
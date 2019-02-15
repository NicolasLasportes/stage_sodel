<?php

//Routes affichage des pages
Route::get('/client/{id}', 'tableauCommande@afficher_tableau_commandes');

Route::get('/commande/{id}', 'tableauDetailCommande@afficher_detail_commande');

Route::get('/clients/{id_representant}', 'tableauCommande@afficher_tableau_commandes');

//Routes pour le détail d'une commande
Route::post('/detailCommandeClient/{id_commande}&{id_client}', 'tableauDetailCommande@obtenir_produix_commande');

Route::post('/ajouterLigneCommande', 'tableauDetailCommande@ajouter_ligne_commande');

Route::post('/supprimerLigneCommande', 'tableauDetailCommande@supprimer_ligne');

Route::post('/modifierLigneCommande', 'tableauDetailCommande@modifier_ligne');

Route::post('/detailClient', 'tableauCommande@detail_client');

//routes pour les commandes d'un client
Route::post('/obtenirClients/{cle_representant}', 'tableauCommande@obtenir_liste_commandes');

Route::post('/commandesClient/{id}', 'tableauCommande@afficher_commande_client');

Route::post('/ajouterCommande', 'tableauCommande@ajouter_commande');

Route::post('/supprimerCommande', 'tableauCommande@supprimer_commande');

Route::post('/modifierCommande', 'tableauCommande@modifier_commande');

Route::post('/detailClientModification', 'tableauCommande@detail_client_modification');

Route::post('/cloturerCommande', 'tableauCommande@cloturer_commande');

Route::post('/envoyer_email_cloture', 'tableauCommande@envoyer_email_cloture');

Route::post('/verifierCommandeCloturer', 'tableauDetailCommande@verifier_commande_cloturer');

Route::post('/envoyer_email', 'tableauDetailCommande@envoyer_email');

//Liste produits
Route::post('/listeProduits/{dossier}', 'produits@obtenir_produits');
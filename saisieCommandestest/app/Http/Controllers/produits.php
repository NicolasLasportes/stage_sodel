<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class produits extends Controller
{
    public function obtenirProduits($dossier)
    {
        include '../../include/connexion.php';

        $sql = "SELECT A0PROD, A0DESI, WWPRNE, WWCOD2, F1QTE FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier' ORDER BY A0PROD, F1QTE";

        $produits = odbc_Exec($conn, $sql);
        $tous_les_produits = [];
        while(odbc_fetch_row($produits))
        {
            $numero_produit = trim(odbc_result($produits, 'A0PROD'));
            $desi_produit = trim(odbc_result($produits, 'A0DESI'));
            $prix_produit = trim(odbc_result($produits, 'WWPRNE'));
            $code_combinaison = trim(odbc_result($produits, 'WWCOD2'));
            $quantite = trim(odbc_result($produits, 'F1QTE'));

            $affichage_json = [
                'numero_produit' => $numero_produit,
                'designation_produit' => utf8_encode($desi_produit),
                'prix_unitaire' => $prix_produit,
                'quantite' => $quantite,
                'code_combinaison' => $code_combinaison
            ];
            
            array_push($tous_les_produits, $affichage_json);
        }

        return $tous_les_produits;
    }

    public function produits()
    {
        include '../../include/connexion.php';

        $tous_les_produits = [];

        $sql = "SELECT * FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = 'yp39y9zOil94mlmqO5wfgFwFvOo'";

        $resultat = odbc_exec($conn, $sql);

        while(odbc_fetch_row($resultat))
        {
            $numero_produit = trim(odbc_result($resultat, 'A0PROD'));
            $desi_produit = trim(odbc_result($resultat, 'A0DESI'));
            $prix_produit = trim(odbc_result($resultat, 'WWPRNE'));
            $code_combinaison = trim(odbc_result($resultat, 'WWCOD2'));
            $quantite = trim(odbc_result($resultat, 'F1QTE'));

            $affichage_json = [
                'numero_produit' => $numero_produit,
                'designation_produit' => utf8_encode($desi_produit),
                'prix_unitaire' => $prix_produit,
                'quantite' => $quantite,
                'code_combinaison' => $code_combinaison
            ];
            
            array_push($tous_les_produits, $affichage_json);
        }
        return $tous_les_produits;
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class produits extends Controller
{
    public function obtenirProduits($dossier)
    {
        include '../../include/connexion.php';

        $sql = "SELECT A0PROD, A0DESI, WWPRNE FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier' AND F1QTE = '1'";

        $produits = odbc_Exec($conn, $sql);
        $tous_les_produits = [];
        while(odbc_fetch_row($produits))
        {
            $numero_produit = trim(odbc_result($produits, 'A0PROD'));
            $desi_produit = trim(odbc_result($produits, 'A0DESI'));
            $prix_produit = trim(odbc_result($produits, 'WWPRNE'));

            $affichage_json = [
                'numero_produit' => $numero_produit,
                'designation_produit' => utf8_encode($desi_produit),
                'prix_unitaire' => $prix_produit
            ];

            array_push($tous_les_produits, $affichage_json);
        }

        return $tous_les_produits;
    }
}
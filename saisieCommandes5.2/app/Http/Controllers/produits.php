<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class produits extends Controller
{
    public function obtenirProduits($dossier)
    {
        include '../../include/connexion.php';

        $sql = "SELECT A0PROD, A0DESI, WWPRNE, WWCOD2, F1QTE FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier'";

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
        // $tous_infos_produits = array(
        //     'tous_les_produits' => $tous_les_produits,
        //     'toutes_les_quantites' =>
        // );

        return $tous_les_produits;
    }
}
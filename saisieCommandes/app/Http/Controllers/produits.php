<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class produits extends Controller
{   
    //cette fonction retourne les informations de tous les produits triés par leur référence puis par quantité dans un tableau d'objets (json)
    //elle prend en paramètre le dossier du client (son id) (présent dans l'url)
    public function obtenir_produits($dossier)
    {
        include '../../include/connexion.php';

        $sql = "SELECT A0PROD, A0DESI, WWPRNE, WWCOD2, F1QTE, WWSTK01, WWSTK02 FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier' 
        ORDER BY A0PROD, F1QTE";

        $produits = odbc_Exec($conn, $sql);
        $tous_les_produits = [];
        while(odbc_fetch_row($produits))
        {
            $numero_produit = trim(odbc_result($produits, 'A0PROD'));
            $desi_produit = trim(odbc_result($produits, 'A0DESI'));
            $prix_produit = trim(odbc_result($produits, 'WWPRNE'));
            $code_combinaison = trim(odbc_result($produits, 'WWCOD2'));
            $quantite = trim(odbc_result($produits, 'F1QTE'));
            $stock01 = trim(odbc_result($produits, 'WWSTK01'));
            $stock02 = trim(odbc_result($produits, 'WWSTK02'));


            $affichage_json = [
                'numero_produit' => $numero_produit,
                'designation_produit' => utf8_encode($desi_produit),
                'prix_unitaire' => $prix_produit,
                'quantite' => $quantite,
                'code_combinaison' => $code_combinaison,
                'stock01' => $stock01,
                'stock02' => $stock02
            ];
            
            array_push($tous_les_produits, $affichage_json);
        }

        return $tous_les_produits;
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class produits extends Controller
{
    public function obtenirProduits($dossier)
    {
        include '../../include/connexion.php';
        $sql = "SELECT A0PROD FROM FILCOMSOD.PRINETP2 WHERE DOSSIER = '" . $dossier . "'";

        $produits = odbc_Exec($conn, $sql);
        $tous_les_produits = [];
        while(odbc_fetch_row($produits))
        {
            $numero_produit = trim(odbc_result($produits, 'A0PROD'));

            $affichage_json = [
                'numero_produit' => $numero_produit
            ];

            array_push($tous_les_produits, $affichage_json);
        }

        return $tous_les_produits;
    }

    // public function obtenirProduits($dossier)
    // {
    //     include '../../include/connexion.php';
    //     //header('Content-Type: application/json; Charset=UTF-8');
    //     $sql = "SELECT A0PROD, WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '77O3yi9p5MMO4l5m9LOOOgwoFf0'";
    //     $produits = odbc_Exec($conn, $sql);
        
    //     echo $produits;
    //     $tous_les_produits = [];
    //     while(odbc_fetch_row($produits)) 
    //     {
    //         echo "je boucle";
    //         $code_produit = trim(odbc_result($produits, 'A0PROD'));
    //         $stock01 = trim(odbc_result($produits, 'WWSTK01'));
    //         $stock02 = trim(odbc_result($produits, 'WWSTK02'));
    //         $commentaire = trim(odbc_result($produits, 'WWTEXTE'));
    //         //$designation_produit = trim(odbc_result($produits, 'A0DESI'));

    //         $affichageJson = [
    //             'code_produit' => $code_produit,
    //             'stock01' => $stock01,
    //             'stock02' => $stock02,
    //             'commentaire' => $commentaire
    //             //'designation_produit' => $designation_produit
    //         ];
    //         dump($affichageJson);
    //         array_push($tous_les_produits, $affichageJson);
    //         print_r($tous_les_produits);
    //         print_r($affichageJson);
    //     }
    //     dd($tous_les_produits); 
    //     return $tous_les_produits;
    // }
}
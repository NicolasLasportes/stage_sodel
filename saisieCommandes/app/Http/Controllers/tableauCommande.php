<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class tableauCommande extends Controller
{
    public function afficherTableauCommandes()
    {
        return view("tableauCommande");
    }

    public function afficherCommandeClient($id)
    {
        include '../../include/connexion.php';
        $sql = "SELECT SONCDE, CECREF, SOTYPO, SODATE, SOCTRA, CENOMF FROM FILCOMSOD.ENTSODP1 WHERE SODOSS = '" . $id . "'"; //AND SOCTRA <> 'LIVRAISON'
        $commandes = odbc_Exec($conn, $sql);

        $toutesLesCommandes = [];
        while(odbc_fetch_row($commandes)) 
        {
            $numero_commande = trim(odbc_result($commandes, 'SONCDE'));
            $reference_commande = trim(odbc_result($commandes, 'CECREF'));
            $type_commande = trim(odbc_result($commandes, 'SOTYPO'));
            $date_commande = trim(odbc_result($commandes, 'SODATE'));
            $cloture_commande = trim(odbc_result($commandes, 'SOCTRA'));
            $nom_client = trim(odbc_result($commandes, 'CENOMF'));

            $affichageJson = [
                'numero_commande' => $numero_commande,
                'reference_commande' => $reference_commande,
                'type_commande' => $type_commande,
                'date_commande' => $date_commande,
                'cloture_commande' => $cloture_commande,
                'nom_client' => $nom_client
            ];

            array_push($toutesLesCommandes, $affichageJson);
        }
        
        return $toutesLesCommandes;
    }

    public function cloturerCommande(Request $request)
    {
        include '../../include/connexion.php';
        $commande_a_cloturer = $request->all();
        $commande_a_cloturer = array_values($commande_a_cloturer);
        $numero_commande = $commande_a_cloturer[0];
        
        $sql = "UPDATE FILCOMSOD.ENTSODP1 SET SOCTRA = 'IPAD' WHERE SONCDE = '$numero_commande'";
        odbc_Exec($conn, $sql);

        $affichageJson = [
            'commande_a_cloturer' => $numero_commande
        ];

        return $affichageJson;
    }
}
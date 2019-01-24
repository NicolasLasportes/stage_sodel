<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class tableauDetailCommande extends Controller
{
    public function afficherDetailCommande()
    {
        return view('tableauDetailCommande');
    }

    public function obtenirProduixCommande($id_commande, $id_client)
    {
        include '../../include/connexion.php';
        
        $liste_commande = [];

        $sql = "SELECT LOSOCI, CDPROD, LOQTEE, LOPRIX FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$id_commande'";

        $detailCommande = odbc_Exec($conn, $sql);
        
        while(odbc_fetch_row($detailCommande))
        {
            $code_societe = trim(odbc_result($detailCommande, 'LOSOCI'));
            $reference_produit = trim(odbc_result($detailCommande, 'CDPROD'));
            $quantite = trim(odbc_result($detailCommande, 'LOQTEE'));
            $prix_unitaire = trim(odbc_result($detailCommande, 'LOPRIX'));
            
            $sql_produit = "SELECT A0SOCI, A0DESI, WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP2 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$id_client' AND A0SOCI = '$code_societe'";
            $produit = odbc_Exec($conn, $sql_produit);
            
            while(odbc_fetch_row($produit))
            {
                $designation = trim(odbc_result($produit, 'A0DESI'));
                $stock01 = trim(odbc_result($produit, 'WWSTK01'));
                $stock02 = trim(odbc_result($produit, 'WWSTK02'));
                $commentaire = trim(odbc_result($produit, 'WWTEXTE'));

                $affichageJson = [
                    'code_societe' => $code_societe,
                    'reference_produit' => $reference_produit,
                    'designation' => $designation,
                    'quantite' => $quantite,
                    'prix_unitaire' => $prix_unitaire,
                    'designation_produit' => $designation,
                    'stock01' => $stock01,
                    'stock02' => $stock02,
                    'commentaire_produit' => $commentaire
                ];

                array_push($liste_commande, $affichageJson);
            }
        }

        return $liste_commande;
    }

    public function ajouterLigneCommande(Request $request)
    {
        include '../../include/connexion.php';

        $produitAjouter = array_values($request->all());

        $numero_commande = $produitAjouter[0];
        $reference_produit = $produitAjouter[1];
        $quantite = $produitAjouter[2];
        $prix_unitaire = $produitAjouter[3];
        $dossier = $produitAjouter[4];
        $gratuit = $produitAjouter[5];

        
        $recuperer_donnees = "SELECT A0SOCI, WWPRNE FROM FILCOMSOD.PRINETP2 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' FETCH FIRST 1 ROWS ONLY";

        $result = odbc_Exec($conn, $recuperer_donnees);

        $code_societe = trim(odbc_result($result, 'A0SOCI'));
        $prix_unitaire_produit = trim(odbc_result($result, 'WWPRNE'));
        

        if($gratuit == "oui")
        {
            $prix_unitaire = 0;
        }
        else if($prix_unitaire == 0)
        {
            $prix_unitaire = $prix_unitaire_produit;
        }
        

        $sql = "INSERT INTO FILCOMSOD.LIGSODP1 VALUES ('$numero_commande', '$code_societe', '$reference_produit', '$quantite', '$prix_unitaire')";

        odbc_Exec($conn, $sql);

        $requeteStock = "SELECT WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP2 WHERE DOSSIER = '$dossier' AND A0PROD = '$reference_produit'";

        $resultatRequeteStock = odbc_Exec($conn, $requeteStock);

        $stock01 = trim(odbc_result($resultatRequeteStock, 'WWSTK01'));
        $stock02 = trim(odbc_result($resultatRequeteStock, 'WWSTK02'));
        $commentaire = trim(odbc_result($resultatRequeteStock, 'WWTEXTE'));

        $affichageJson = [
            'numero_commande' => $numero_commande,
            "dossier" => $dossier,
            'code_societe' => $code_societe,
            'reference_produit' => $reference_produit,
            'quantite' => $quantite,
            'prix_unitaire' => $prix_unitaire,
            'prix_unitaire_final' => $prix_unitaire_produit,
            'gratuit' => $gratuit,
            'stock01' => $stock01,
            'stock02' => $stock02,
            'commentaire' => $commentaire
        ];
        
        return $affichageJson;
    }

    public function supprimerLigne(Request $request)
    {
        include '../../include/connexion.php';

        $produitASupprimer = array_values($request->all());

        $numero_commande = $produitASupprimer[0];
        $code_produit = $produitASupprimer[1];
        
        $sql = "DELETE FROM LIGSODP1 WHERE LONCDE = '$numero_commande' AND CDPROD = '$code_produit'";

        odbc_Exec($conn, $sql);

        $affichageJson = [
            'numero_commande' => $numero_commande,
            'code_produit' => $code_produit
        ];

        return $affichageJson;
    }

    public function modifierLigne(Request $request)
    {
        include '../../include/connexion.php';

        $ligneAModifier = array_values($request->all());

        $numero_commande = $ligneAModifier[0];
        $code_societe = $ligneAModifier[1]; 
        $reference_produit = $ligneAModifier[2];
        $quantite = $ligneAModifier[3];
        $prix_unitaire = $ligneAModifier[4];
        $gratuit = $ligneAModifier[5];
        $dossier = $ligneAModifier[6];
     
        if($gratuit === "true")
        {
            $prix_unitaire = 0;
        }

        if($gratuit === "false" && $prix_unitaire == 0)
        {
            $recuperer_prix_unitaire = "SELECT WWPRNE FROM FILCOMSOD.PRINETP2 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' FETCH FIRST 1 ROWS ONLY";
            
            $result = odbc_Exec($conn, $recuperer_prix_unitaire);
            
            $prix_unitaire = trim(odbc_result($result, 'WWPRNE'));
        }

        $sql = "UPDATE FILCOMSOD.LIGSODP1 SET LOQTEE = '$quantite', LOPRIX = '$prix_unitaire' WHERE LONCDE = '$numero_commande' AND LOSOCI = '$code_societe' AND CDPROD = '$reference_produit'";
        
        odbc_Exec($conn, $sql);

        $affichageJson = [
            'numero_commande' => $numero_commande,
            'code_societe' => $code_societe,
            'reference_produit' => $reference_produit,
            'quantite' => $quantite,
            'prix_unitaire' => $prix_unitaire,
            'gratuit' => $gratuit,
            'dossier' => $dossier
        ];

        return $affichageJson;
    }

    public function verifierCommandeCloturer(Request $request)
    {
        include '../../include/connexion.php';

        $donnees = array_values($request->all());
        
        $numero_commande = $donnees[0];

        $sql = "SELECT SOCTRA FROM FILCOMSOD.ENTSODP1 WHERE SONCDE = '$numero_commande'";
        $resultat = odbc_Exec($conn, $sql);

        $commande_cloturer = trim(odbc_result($resultat, 'SOCTRA'));

        $affichageJson = [
            'numero_commande' => $numero_commande,
            'cloturer_commande' => $commande_cloturer
        ];
        
        return $affichageJson;
    }
}

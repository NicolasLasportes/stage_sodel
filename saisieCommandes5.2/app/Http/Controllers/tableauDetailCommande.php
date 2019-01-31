<?php

namespace App\Http\Controllers;

use Mail;

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
            
            $sql_produit = "SELECT A0SOCI, A0DESI, WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$id_client' AND F1QTE = '1' AND A0SOCI = '$code_societe'";
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
                    'quantite' => $quantite,
                    'prix_unitaire' => $prix_unitaire,
                    'designation_produit' => utf8_encode($designation),
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

        
        $recuperer_donnees = "SELECT A0SOCI, WWPRNE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' AND F1QTE = '1' FETCH FIRST 1 ROWS ONLY";

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

        $requeteStock = "SELECT WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier' AND A0PROD = '$reference_produit'";

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
            $recuperer_prix_unitaire = "SELECT WWPRNE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' FETCH FIRST 1 ROWS ONLY";
            
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

    public function envoyer_email(Request $request)
    {
        $donnees = array_values($request->all());
        $numero_commande = $donnees[0];
        $dossier = $donnees[1];

        $sql = "SELECT SODATE, CENOMF, SOMAIF, SOAD1F, SOAD2F, SOPOSF, SOLVIF, SOPAYF, SOTELF, CECREF, SOCOMM, CENOML, SONOML, SOTELL, CEAD1L, CEAD2L, CEPOSL, CELVIL, SOPAYL,
        SOMAIL, SOTYPO";

        $entete_commande = odbc_exec($conn, $sql);

        $date_du_jour = trim(odbc_result($entete_commande, 'SODATE'));
        $nom_facture = trim(odbc_result($entete_commande, 'CENOMF'));
        $mail_facture = trim(odbc_result($entete_commande, 'SOMAIF'));
        $telephone_facture = trim(odbc_result($entete_commande, 'SOTELF'));
        $adresse1_facture = trim(odbc_result($entete_commande, 'SOAD1F'));
        $adresse2_facture = trim(odbc_result($entete_commande, 'SOAD2F'));
        $code_postal_facture = trim(odbc_result($entete_commande, 'SOPOSF'));
        $ville_facture = trim(odbc_result($entete_commande, 'SOLVIF'));
        $pays_facture = trim(odbc_result($entete_commande, 'SOPAYF'));
        $nom_livraison = trim(odbc_result($entete_commande, 'CENOML'));
        $prenom_livraison = trim(odbc_result($entete_commande, 'SONOML'));
        $mail_livraison = trim(odbc_result($entete_commande, 'SOMAIL'));
        $telephone_livraison = trim(odbc_result($entete_commande, 'SOTELL'));
        $adresse1_livraison = trim(odbc_result($entete_commande, 'CEAD1L'));
        $adresse2_livraison = trim(odbc_result($entete_commande, 'CEAD2L'));
        $code_postal_livraison = trim(odbc_result($entete_commande, 'CEPOSL'));
        $ville_livraison = trim(odbc_result($entete_commande, 'CELVIL'));
        $pays_livraison = trim(odbc_result($entete_commande, 'SOPAYL'));
        $reference_commande = trim(odbc_result($entete_commande, 'CECREF'));
        $type_commande = trim(odbc_result($entete_commande, 'SOTYPO'));
        $commentaire_commande = trim(odbc_result($entete_commande, 'SOCOMM'));

    }
}


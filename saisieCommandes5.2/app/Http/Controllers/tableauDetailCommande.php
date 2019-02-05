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

        $recuperer_nom_client = "SELECT CENOMF FROM FILCOMSOD.ENTSODP1 WHERE SODOSS = '$id_client'";
        
        $resultat_nom_client  = odbc_exec($conn, $recuperer_nom_client);

        $nom_client = trim(odbc_result($resultat_nom_client, 'CENOMF'));
        
        $liste_commande = [
            'nom_client' => $nom_client
        ];

        $sql = "SELECT LOSOCI, CDPROD, LOQTEE, LOPRIX FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$id_commande'";

        $detailCommande = odbc_Exec($conn, $sql);
        
        while(odbc_fetch_row($detailCommande))
        {
            $code_societe = trim(odbc_result($detailCommande, 'LOSOCI'));
            $reference_produit = trim(odbc_result($detailCommande, 'CDPROD'));
            $quantite = trim(odbc_result($detailCommande, 'LOQTEE'));
            $prix_unitaire = trim(odbc_result($detailCommande, 'LOPRIX'));
            
            $sql_produit = "SELECT A0SOCI, A0DESI, WWSTK01, WWSTK02, WWTEXTE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$id_client' 
            AND F1QTE = '1' AND A0SOCI = '$code_societe'";
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
        $code_combinaison = $produitAjouter[6];
        $affichageFinal = [];
        $prix_speciaux = [];
        $plus_grande_quantite = 0;

        if($code_combinaison == "S")
        {
            $recuperer_prix_quantite = "SELECT A0SOCI, WWPRNE, F1QTE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' 
            AND F1QTE <= '$quantite'";

            $result = odbc_exec($conn, $recuperer_prix_quantite);

            while(odbc_fetch_row($result))
            {
                $code_societe = trim(odbc_result($result, 'A0SOCI'));
                $prix_unitaire_produit = trim(odbc_result($result, 'WWPRNE'));
                $quantite_prix = trim(odbc_result($result, 'F1QTE'));
    
                $produit = [$prix_unitaire_produit, $quantite_prix, $code_societe];
    
                array_push($prix_speciaux, $produit);
            }

            foreach($prix_speciaux as $cle)
            {
                if($cle[1] > $plus_grande_quantite)
                {
                    $plus_grande_quantite = $cle[1];
                    $prix_par_quantite_final = $cle;
                }
            }
            $code_societe = $prix_par_quantite_final[2];
            $prix_unitaire_produit = $prix_par_quantite_final[0];
        }
        else
        {
            $recuperer_prix_quantite = "SELECT A0SOCI, WWPRNE, F1QTE FROM FILCOMSOD.PRINETP1 WHERE A0PROD = '$reference_produit' AND DOSSIER = '$dossier' AND F1QTE = '1'";
            
            $result = odbc_Exec($conn, $recuperer_prix_quantite);

            $code_societe = trim(odbc_result($result, 'A0SOCI'));
            $prix_unitaire_produit = trim(odbc_result($result, 'WWPRNE'));
            $quantite_prix = trim(odbc_result($result, 'F1QTE'));
        }
        
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
            'dossier' => $dossier,
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
        
        array_push($affichageFinal, $affichageJson);

        return $affichageFinal;
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

        $sql = "UPDATE FILCOMSOD.LIGSODP1 SET LOQTEE = '$quantite', LOPRIX = '$prix_unitaire' WHERE LONCDE = '$numero_commande' AND LOSOCI = '$code_societe' 
        AND CDPROD = '$reference_produit'";
        
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
        include '../../include/connexion.php';

        $donnees = array_values($request->all());
        $numero_commande = $donnees[0];
        $dossier = $donnees[1];
        
        $recuperer_entete_commande = "SELECT SODATE, CENOMF, SOMAIF, SOAD1F, SOAD2F, SOPOSF, SOLVIF, SOPAYF, SOTELF, CECREF, SOCOMM, CENOML, SONOML, SOTELL, 
        CEAD1L, CEAD2L, CEPOSL, CELVIL, SOPAYL, SOMAIL, SOTYPO FROM FILCOMSOD.ENTSODP1 WHERE SONCDE = '$numero_commande' AND SODOSS = '$dossier'";

        $entete_commande = odbc_exec($conn, $recuperer_entete_commande);

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

        $recapitulatif_commande = [
            'numero_commande' => $numero_commande,
            'date' => $date_du_jour,
            'nom_facture' => utf8_encode($nom_facture),
            'mail_facture' => $mail_facture,
            'telephone_facture' => $telephone_facture,
            'adresse1_facture' => utf8_encode($adresse1_facture),
            'adresse2_facture' => utf8_encode($adresse2_facture),
            'code_postal_facture' => $code_postal_facture,
            'ville_facture' => utf8_encode($ville_facture),
            'pays_facture' => utf8_encode($pays_facture),
            'nom_livraison' => utf8_encode($nom_livraison),
            'prenom_livraison' => utf8_encode($prenom_livraison),
            'mail_livraison' => $mail_livraison,
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => utf8_encode($adresse1_livraison),
            'adresse2_livraison' => utf8_encode($adresse2_livraison),
            'code_postal_livraison' => $code_postal_livraison,
            'ville_livraison' => utf8_encode($ville_livraison),
            'pays_livraison' => utf8_encode($pays_livraison),
            'reference_commande' => utf8_encode($reference_commande),
            'type_commande' => $type_commande,
            'commentaire_commande' => utf8_encode($commentaire_commande)
        ];

        $recuperer_lignes_commande = "SELECT LOSOCI, CDPROD, LOQTEE, LOPRIX FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$numero_commande'";

        $ligne_commande = odbc_exec($conn, $recuperer_lignes_commande);

        while(odbc_fetch_row($ligne_commande))
        {
            $code_societe = trim(odbc_result($ligne_commande, 'LOSOCI'));
            $reference_produit = trim(odbc_result($ligne_commande, 'CDPROD'));
            $quantite = trim(odbc_result($ligne_commande, 'LOQTEE'));
            $prix_unitaire = trim(odbc_result($ligne_commande, 'LOPRIX'));

            $recuperer_infos_produit = "SELECT A0DESI FROM FILCOMSOD.PRINETP1 WHERE DOSSIER = '$dossier' AND A0PROD = '$reference_produit' AND A0SOCI = '$code_societe'";

            $infos_produit = odbc_exec($conn, $recuperer_infos_produit);

            $designation_produit = utf8_encode(trim(odbc_result($infos_produit, 'A0DESI')));

            $ligne = [
                'designation_produit' => $designation_produit,
                'code_societe' => $code_societe,
                'reference_produit' => $reference_produit,
                'quantite' => $quantite,
                'prix_unitaire' => $prix_unitaire
            ];

            array_push($recapitulatif_commande, $ligne);
        }

        return $recapitulatif_commande;
    }
}


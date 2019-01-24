<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class tableauCommande extends Controller
{
    public function afficherTableauCommandes()
    {
        return view("tableauCommande");
    }

    public function afficherCommandeClient($dossier_client)
    {
        include '../../include/connexion.php';
        $toutesLesCommandes = [];
        
        $sql = "SELECT SONCDE, CECREF, SOTYPO, SODATE, SOCTRA, CENOMF FROM FILCOMSOD.ENTSODP1 WHERE SODOSS = '$dossier_client' AND SOCTRA <> 'LIVRAISON'";
        
        $commandes = odbc_Exec($conn, $sql);

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
                'cloture_commande' => $cloture_commande
            ];

            array_push($toutesLesCommandes, $affichageJson);
        }

        $recuperer_nom_client = "SELECT TITNOM FROM FILCOMSOD.TIEWEBP1 WHERE DOSSIER = '$dossier_client'";
        $resultat = odbc_exec($conn, $recuperer_nom_client);
        $nom_client = [
            'nom_client' => trim(odbc_result($resultat, 'TITNOM'))
        ];

        array_push($toutesLesCommandes, $nom_client);

        return $toutesLesCommandes;
    }

    public function cloturerCommande(Request $request)
    {
        include '../../include/connexion.php';
        $commande_a_cloturer = array_values($request->all());
        $numero_commande = $commande_a_cloturer[0];
        
        $sql = "UPDATE FILCOMSOD.ENTSODP1 SET SOCTRA = 'IPAD' WHERE SONCDE = '$numero_commande'";
        odbc_Exec($conn, $sql);

        $affichageJson = [
            'commande_a_cloturer' => $numero_commande
        ];

        return $affichageJson;
    }

    public function detailClient(Request $request)
    {
        include '../../include/connexion.php';

        $dossier = array_values($request->all());
        $dossier = $dossier[0];

        $sql = "SELECT TITELE, TITNOM, TSMEL1, TIADR1, TIADR2, TINVOI, TICPOS, TIVILL FROM TIEWEBP1 WHERE DOSSIER = '$dossier'";
        $resultat = odbc_Exec($conn, $sql);

        $nom_client = trim(odbc_result($resultat, 'TITNOM'));
        $telephone_client = trim(odbc_result($resultat, 'TITELE'));
        $mail_client = trim(odbc_result($resultat, 'TSMEL1'));
        $nom_voie_client = trim(odbc_result($resultat, 'TIADR1'));
        $complement = trim(odbc_result($resultat, 'TIADR2'));
        $num_voie_client = trim(odbc_result($resultat, 'TINVOI'));
        $code_postal_client = trim(odbc_result($resultat, 'TICPOS'));
        $ville_client = trim(odbc_result($resultat, 'TIVILL'));

        $affichageJson = [
            'nom_client' => $nom_client,
            'telephone_client' => $telephone_client,
            'mail_client' => $mail_client,
            'nom_voie_client' => $nom_voie_client,
            'complement' => $complement,
            'num_voie_client' => $num_voie_client,
            'code_postal_client' => $code_postal_client,
            'ville_client' => $ville_client
        ];

        return $affichageJson;
    }

    public function ajouterCommande(Request $request)
    {
        include '../../include/connexion.php';

        $detailCommande = array_values($request->all());
        $date_du_jour = date("Y-m-d");
        $nom_client = $detailCommande[0];
        $mail_client = $detailCommande[1];
        $telephone_client = $detailCommande[2];
        $adresse1_client = $detailCommande[3];
        $adresse2_client = $detailCommande[4];
        $ville_client = $detailCommande[5];
        $code_postal_client = $detailCommande[6];
        $nom_livraison = $detailCommande[7];
        $prenom_livraison = $detailCommande[8];
        $mail_livraison = $detailCommande[9];
        $telephone_livraison = $detailCommande[10];
        $adresse1_livraison = $detailCommande[11];
        $adresse2_livraison = $detailCommande[12];
        $ville_livraison = $detailCommande[13];
        $code_postal_livraison = $detailCommande[14];
        $reference_commande = $detailCommande[15];
        $type_commande = $detailCommande[16];
        $commentaire_commande = $detailCommande[17];
        $dossier_client = $detailCommande[18];
        $adresse3_client = '';
        $prefixe_facture = '';
        $adresse3_livraison = '';
        $cloturer = '';
        $cout_transport = 0;
        $pdf = '';
        $numero_ordre = 0;

        $recuperer_dernier_num_commande = "SELECT TLVAL1 FROM FILBASSOD.TABLIGP1 WHERE TLIDEN = 'NCDE'";
        $resultat = odbc_exec($conn, $recuperer_dernier_num_commande);
        $dernier_numero_commande = trim(odbc_result($resultat, 'TLVAL1'));
        $numero_commande = $dernier_numero_commande + 1;

        $maj_numero_commande = "UPDATE FILBASSOD.TABLIGP1 SET TLVAL1 = '$numero_commande' WHERE TLIDEN = 'NCDE'";
        odbc_exec($conn, $maj_numero_commande);

        
        $recuperer_info_client = "SELECT CUSTOMER, TISOC2, TINCL2, TI\$PAY FROM FILCOMSOD.TIEWEBP1 WHERE DOSSIER = '$dossier_client'";
        $resultat = odbc_exec($conn, $recuperer_info_client);
        $numero_client = trim(odbc_result($resultat, 'CUSTOMER'));
        $code_societe = trim(odbc_result($resultat, 'TISOC2'));
        $code_client = trim(odbc_result($resultat, 'TINCL2'));
        $pays_client = trim(odbc_result($resultat, 'TI$PAY'));

        $recuperer_pays_client = "SELECT TLLIBE FROM FILBASSOD.TABLIGP1 WHERE TLIDEN = 'PAYS' AND TLARGU = '$pays_client'";
        $result = odbc_exec($conn, $recuperer_pays_client);
        $pays = trim(odbc_result($result, 'TLLIBE'));
        
        $ajouter_commande = "INSERT INTO FILCOMSOD.ENTSODP1 VALUES ('$numero_commande', '$date_du_jour', '$numero_client', '$nom_client', '$mail_client', '$adresse1_client', 
        '$adresse2_client', '$adresse3_client', '$code_postal_client', '$ville_client', '$pays', '$telephone_client', '$prefixe_facture', '$nom_livraison', '$prenom_livraison', 
        '$telephone_livraison', '$adresse1_livraison', '$adresse2_livraison', '$adresse3_livraison', '$code_postal_livraison', '$ville_livraison', '$pays_client', '$mail_livraison', 
        '$telephone_livraison', '$cloturer', '$cout_transport', '$reference_commande', '$commentaire_commande', '$pdf', '$numero_ordre', '$numero_commande', '$type_commande', 
        '$code_societe', '$code_client', '$dossier_client')";

        odbc_Exec($conn, $ajouter_commande);
        
        $affichageJson = [
            'date_du_jour' => $date_du_jour,
            'nom_client' => $nom_client,
            'mail_client' => $mail_client,
            'telephone_client' => $telephone_client,
            'adresse1_client' => $adresse1_client,
            'adresse2_client' => $adresse2_client,
            'ville_client' => $ville_client,
            'code_postal_client' => $code_postal_client,
            'nom_livraison' => $nom_livraison,
            'prenom_livraison' => $prenom_livraison,
            'mail_livraison' => $mail_livraison,
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => $adresse1_livraison,
            'adresse2_livraison' => $adresse2_livraison,
            'ville_livraison' => $ville_livraison,
            'code_postal_livraison' => $code_postal_livraison,
            'reference_commande' => $reference_commande,
            'type_commande' => $type_commande,
            'commentaire_commande' => $commentaire_commande,
            'dossier_client' => $dossier_client,
            'numero_commande' => $numero_commande,
            'numero_client' => $numero_client,
            'code_societe' => $code_societe,
            'code_client' => $code_client
        ];

        return $affichageJson;
    }

    public function supprimerCommande(Request $request)
    {
        include '../../include/connexion.php';

        $donnees = array_values($request->all());
        $numero_commande = $donnees[0];

        $sql = "DELETE FROM FILCOMSOD.ENTSODP1 WHERE SONCDE = '$numero_commande'";
        odbc_Exec($conn, $sql);

        $affichageJson = [
            'numero_commande_supprime' => $numero_commande
        ];

        return $affichageJson;
    }

    public function modifierCommande(Request $request)
    {
        include '../../include/connexion.php';

        $donnees = array_values($request->all());

        $numero_commande = $donnees[0];
        $reference_commande = $donnees[1];
        $type_commande = $donnees[2];
        $commentaire_commande = $donnees[3];
        $nom_livraison = $donnees[4];
        $prenom_livraison = $donnees[5];
        $telephone_livraison = $donnees[6];
        $email_livraison = $donnees[7];
        $adresse1_livraison = $donnees[8];
        $adresse2_livraison = $donnees[9];
        $ville_livraison = $donnees[10];
        $code_postal_livraison = $donnees[11];

        $sql = "UPDATE FILCOMSOD.ENTSODP1 SET CENOML = '$nom_livraison', SONOML = '$prenom_livraison', SOTELL = '$telephone_livraison', CEAD1L = '$adresse1_livraison', 
        CEAD2L = '$adresse2_livraison', CEPOSL = '$code_postal_livraison', CELVIL = '$ville_livraison', SOMAIL = '$email_livraison', SOTEL2 = '$telephone_livraison', 
        SOTYPO = '$type_commande', SOCOMM = '$commentaire_commande', CECREF = '$reference_commande' WHERE SONCDE = '$numero_commande'";

        odbc_Exec($conn, $sql);

        $reponse = [
            'numero_commande' => $numero_commande,
            'nom_livraison' => $nom_livraison,
            'prenom_livraison' => $prenom_livraison,
            'mail_livraison' => $email_livraison,
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => $adresse1_livraison,
            'adresse2_livraison' => $adresse2_livraison,
            'ville_livraison' => $ville_livraison,
            'code_postal_livraison' => $code_postal_livraison,
            'reference_commande' => $reference_commande,
            'type_commande' => $type_commande,
            'commentaire_commande' => $commentaire_commande
        ];

        return $reponse;
    }

    public function detailClientModification(Request $request)
    {   
        include '../../include/connexion.php';

        $donnees = array_values($request->all());

        $numero_commande = $donnees[0];
        $dossier = $donnees[1];

        $sql = "SELECT CENOMF, SOMAIF, SOAD1F, SOAD2F, SOPOSF, SOLVIF, SOTELF, CENOML, SONOML, SOTELL, CEAD1L, CEAD2L, CEPOSL, CELVIL, SOMAIL, SOCOMM, SOTYPO, CECREF FROM 
        FILCOMSOD.ENTSODP1 WHERE SODOSS = '$dossier' AND SONCDE = '$numero_commande'";

        $resultat = odbc_Exec($conn, $sql);

        $nom_facture = trim(odbc_result($resultat, 'CENOMF'));
        $telephone_facture = trim(odbc_result($resultat, 'SOTELF'));
        $mail_facture = trim(odbc_result($resultat, 'SOMAIF'));
        $adresse1_facture = trim(odbc_result($resultat, 'SOAD1F'));
        $adresse2_facture = trim(odbc_result($resultat, 'SOAD2F'));
        $code_postal_facture = trim(odbc_result($resultat, 'SOPOSF'));
        $ville_facture = trim(odbc_result($resultat, 'SOLVIF'));
        $nom_livraison = trim(odbc_result($resultat, 'CENOML'));
        $prenom_livraison = trim(odbc_result($resultat, 'SONOML'));
        $telephone_livraison = trim(odbc_result($resultat, 'SOTELL'));
        $mail_livraison = trim(odbc_result($resultat, 'SOMAIL'));
        $adresse1_livraison = trim(odbc_result($resultat, 'CEAD1L'));
        $adresse2_livraison = trim(odbc_result($resultat, 'CEAD2L'));
        $code_postal_livraison = trim(odbc_result($resultat, 'CEPOSL'));
        $ville_livraison = trim(odbc_result($resultat, 'CELVIL'));
        $reference_commande = trim(odbc_result($resultat, 'CECREF'));
        $type_commande = trim(odbc_result($resultat, 'SOTYPO'));
        $commentaire_commande = trim(odbc_result($resultat, 'SOCOMM'));

        $affichageJson = [
            'numero_commande' => $numero_commande,
            'dossier' => $dossier,
            'nom_client_facture' => $nom_facture,
            'mail_client_facture' => $mail_facture,
            'telephone_client_facture' => $telephone_facture,
            'adresse1_client_facture' => $adresse1_facture,
            'adresse2_client_facture' => $adresse2_facture,
            'ville_client_facture' => $ville_facture,
            'code_postal_client_facture' => $code_postal_facture,
            'nom_livraison' => $nom_livraison,
            'prenom_livraison' => $prenom_livraison,
            'mail_livraison' => $mail_livraison,
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => $adresse1_livraison,
            'adresse2_livraison' => $adresse2_livraison,
            'ville_livraison' => $ville_livraison,
            'code_postal_livraison' => $code_postal_livraison,
            'reference_commande' => $reference_commande,
            'type_commande' => $type_commande,
            'commentaire_commande' => $commentaire_commande
        ];
        
        return $affichageJson;
    }
}
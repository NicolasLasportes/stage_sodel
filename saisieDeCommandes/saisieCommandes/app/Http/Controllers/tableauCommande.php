<?php

namespace App\Http\Controllers;

use Mail;

use Illuminate\Http\Request;

class tableauCommande extends Controller
{
    //affiche la page tableauCommande
    public function afficher_tableau_commandes()
    {
        return view("tableauCommande");
    }

    /*récupère les informations de toutes les commandes d'un client 
    (prend en paramètre le dossier du client fournis dans l'url)
    et récupère également le nom du client */  
     public function afficher_commande_client($dossier_client)
    {
        include '../../include/connexion.php';
        $toutes_les_commandes = [];
        $total = [];
        $sql = "SELECT SONCDE, CECREF, SOTYPO, SODATE, SOCTRA, CENOMF, SOVALI FROM 
        FILCOMSOD.ENTSODP1 WHERE SODOSS = '" . str_replace("'", "''", $dossier_client) . "' 
        AND SOCTRA <> 'LIVRAISON'";
       
        $commandes = odbc_Exec($conn, $sql);

        while(odbc_fetch_row($commandes)) 
        {
            $numero_commande = trim(odbc_result($commandes, 'SONCDE'));
            $reference_commande = trim(odbc_result($commandes, 'CECREF'));
            $type_commande = trim(odbc_result($commandes, 'SOTYPO'));
            $date_commande = trim(odbc_result($commandes, 'SODATE'));
            $cloture_commande = trim(odbc_result($commandes, 'SOCTRA'));
            $nom_client = utf8_encode(trim(odbc_result($commandes, 'CENOMF')));
            $sovali = trim(odbc_result($commandes, 'SOVALI'));

            $recuperer_total_commande = "SELECT LOQTEE, LOPRIX 
            FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = 
            '" . str_replace("'", "''", $numero_commande) . "'";

            $resultat = odbc_exec($conn, $recuperer_total_commande);

            while(odbc_fetch_row($resultat))
            {
                $prix_unitaire = trim(odbc_result($resultat, 'LOQTEE'));
                $quantite = trim(odbc_result($resultat, 'LOPRIX'));
                array_push($total, $prix_unitaire * $quantite);
            }

            $affichage_json = [
                'numero_commande' => $numero_commande,
                'reference_commande' => utf8_encode($reference_commande),
                'type_commande' => $type_commande,
                'date_commande' => $date_commande,
                'cloture_commande' => $cloture_commande,
                'ventiler_commande' => $sovali,
                'nom_facture' => utf8_encode($nom_client),
                'dossier' => $dossier_client,
                'total' => array_sum($total)
            ];
            
            $total = [];
            array_push($toutes_les_commandes, $affichage_json);
        }

        $recuperer_nom_client = "SELECT TITNOM FROM FILCOMSOD.TIEWEBP1 
        WHERE DOSSIER = '" . str_replace("'", "''", $dossier_client) . "'";
        $resultat = odbc_exec($conn, $recuperer_nom_client);
        $nom_client = [
            'nom_client' => utf8_encode(trim(odbc_result($resultat, 'TITNOM')))
        ];

        array_push($toutes_les_commandes, $nom_client);

        return $toutes_les_commandes;
    }

    //prend en paramètre le numéro de la commande et la cloture
    //retourne le numéro de la commande cloturé
    public function cloturer_commande(Request $request)
    {
        include '../../include/connexion.php';
        $commande_a_cloturer = array_values($request->all());
        $numero_commande = $commande_a_cloturer[0];
        
        $sql = "UPDATE FILCOMSOD.ENTSODP1 SET SOCTRA = 'IPAD' 
        WHERE SONCDE = '" . intval($numero_commande) . "'";
        odbc_Exec($conn, $sql);

        $affichage_json = [
            'commande_a_cloturer' => $numero_commande
        ];

        return $affichage_json;
    }

    //prend en parametre le dossier d'un client (son id) et retourne ses informations de facturation ainsi que la clé et le numéro du commercial qui s'en occupe
    public function detail_client(Request $request)
    {
        include '../../include/connexion.php';

        $dossier = array_values($request->all());
        $dossier = $dossier[0];

        $sql = "SELECT TITELE, TITNOM, TSMEL1, TIADR1, TIADR2, TINVOI, TICPOS, TIVILL, TICLEE, TINREP FROM TIEWEBP1 WHERE DOSSIER = '$dossier'";
        $resultat = odbc_Exec($conn, $sql);

        $nom_client = utf8_encode(trim(odbc_result($resultat, 'TITNOM')));
        $telephone_client = trim(odbc_result($resultat, 'TITELE'));
        $mail_client = trim(odbc_result($resultat, 'TSMEL1'));
        $nom_voie_client = utf8_encode(trim(odbc_result($resultat, 'TIADR1')));
        $complement = utf8_encode(trim(odbc_result($resultat, 'TIADR2')));
        $num_voie_client = utf8_encode(trim(odbc_result($resultat, 'TINVOI')));
        $code_postal_client = trim(odbc_result($resultat, 'TICPOS'));
        $ville_client = utf8_encode(trim(odbc_result($resultat, 'TIVILL')));
        $cle_representant = utf8_encode(trim(odbc_result($resultat, 'TICLEE')));
        $num_representant = utf8_encode(trim(odbc_result($resultat, 'TINREP')));

        $affichageJson = [
            'nom_client' => $nom_client,
            'telephone_client' => $telephone_client,
            'mail_client' => $mail_client,
            'nom_voie_client' => $nom_voie_client,
            'complement' => $complement,
            'num_voie_client' => $num_voie_client,
            'code_postal_client' => $code_postal_client,
            'ville_client' => $ville_client,
            'cle_representant' => $cle_representant,
            'numero_representant' => $num_representant
        ];

        return $affichageJson;
    }

    //prend en paramètre les informations de facturation et de livraison du client ainsi que son dossier, les informations du représentant et celles de la commande
    //insère tout ca dans la base de données après les avoir converti en iso-8859-1 (encodage de la base de données)et retourne tout ce qui a été inséré
    public function ajouter_commande(Request $request)
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
        $cle_representant = $detailCommande[19];
        $num_representant = $detailCommande[20];
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

        $liste_valeurs_a_echapper = [$reference_commande, $commentaire_commande, $nom_livraison, $prenom_livraison, $adresse1_livraison, $adresse2_livraison, $ville_livraison, 
        $nom_client, $adresse1_client, $adresse2_client, $ville_client];

        $mot_apres_echappement = [];
        $liste_valeurs_echappees = [];
        
        foreach($liste_valeurs_a_echapper as $valeur_a_echapper)
        {
            $mot_apres_echappement = str_replace("'", "''", $valeur_a_echapper);

            array_push($liste_valeurs_echappees, $mot_apres_echappement);
            $mot_apres_echappement = [];
        }

        $commentaire_commande_encode = mb_convert_encoding($liste_valeurs_echappees[1], "iso-8859-1", "UTF-8");
        $reference_commande_encode = mb_convert_encoding($liste_valeurs_echappees[0], "iso-8859-1", "UTF-8");
        $nom_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[2], "iso-8859-1", "UTF-8");
        $prenom_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[3], "iso-8859-1", "UTF-8");
        $adresse1_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[4], "iso-8859-1", "UTF-8");
        $adresse2_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[5], "iso-8859-1", "UTF-8");
        $ville_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[6], "iso-8859-1", "UTF-8");
        
        $nom_client_encode = mb_convert_encoding($liste_valeurs_echappees[7], "iso-8859-1", "UTF-8");
        $adresse1_client_encode = mb_convert_encoding($liste_valeurs_echappees[8], "iso-8859-1", "UTF-8");
        $adresse2_client_encode = mb_convert_encoding($liste_valeurs_echappees[9], "iso-8859-1", "UTF-8");
        $ville_client_encode = mb_convert_encoding($liste_valeurs_echappees[10], "iso-8859-1", "UTF-8");

        $ajouter_commande = "INSERT INTO FILCOMSOD.ENTSODP1 VALUES ('$numero_commande', '$date_du_jour', '$numero_client', '$nom_client_encode', '$mail_client', 
        '$adresse1_client_encode', '$adresse2_client_encode', '$adresse3_client', '$code_postal_client', '$ville_client_encode', '$pays', '$telephone_client', 
        '$prefixe_facture', '$nom_livraison_encode', '$prenom_livraison_encode', '$telephone_livraison', '$adresse1_livraison_encode', '$adresse2_livraison_encode', 
        '$adresse3_livraison', '$code_postal_livraison', '$ville_livraison_encode', '$pays_client', '$mail_livraison', '$telephone_livraison', '$cloturer', '$cout_transport', 
        '$reference_commande_encode', '$commentaire_commande_encode', '$pdf', '$numero_ordre', '$numero_commande', '$type_commande', '$code_societe', '$code_client', 
        '$dossier_client', '$cle_representant', '$num_representant')";

        odbc_Exec($conn, $ajouter_commande);

        $affichageJson = [
            'date_du_jour' => $date_du_jour,
            'nom_client' => utf8_encode($nom_client),
            'mail_client' => $mail_client,
            'telephone_client' => $telephone_client,
            'adresse1_client' => utf8_encode($adresse1_client),
            'adresse2_client' => utf8_encode($adresse2_client),
            'ville_client' => utf8_encode($ville_client),
            'code_postal_client' => $code_postal_client,
            'nom_livraison' => utf8_encode($nom_livraison),
            'prenom_livraison' => utf8_encode($prenom_livraison),
            'mail_livraison' => $mail_livraison,
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => utf8_encode($adresse1_livraison),
            'adresse2_livraison' => utf8_encode($adresse2_livraison),
            'code_postal_livraison' => $code_postal_livraison,
            'ville_livraison' => utf8_encode($ville_livraison),
            'reference_commande' => utf8_encode($reference_commande),
            'type_commande' => $type_commande,
            'commentaire_commande' => utf8_encode($commentaire_commande),
            'dossier_client' => $dossier_client,
            'numero_commande' => $numero_commande,
            'numero_client' => $numero_client,
            'code_societe' => $code_societe,
            'code_client' => $code_client,
            'cle_representant' => $cle_representant,
            'numero_representant' => $num_representant
        ];

        return $affichageJson;
    }

    //prend en paramètre le numéro de la commande et la supprime de la base de données
    //retourne le numéro de la commande
    public function supprimer_commande(Request $request)
    {
        include '../../include/connexion.php';

        $donnees = array_values($request->all());
        $numero_commande = $donnees[0];

        $sql = "DELETE FROM FILCOMSOD.ENTSODP1 WHERE SONCDE = '$numero_commande'";
        odbc_Exec($conn, $sql);

        $supprimer_ligne = "DELETE FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$numero_commande'";
        odbc_Exec($conn, $supprimer_ligne);

        $affichageJson = [
            'numero_commande_supprime' => $numero_commande
        ];

        return $affichageJson;
    }

    //prend en paramètre les informations de livraison du client ainsi que les informations d'entête de la commande et modifie les informations dans la base de données
    //avec celles-ci, retourne les informations passées en paramètre  
    public function modifier_commande(Request $request)
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

        $liste_valeurs_a_echapper = [$reference_commande, $commentaire_commande, $nom_livraison, $prenom_livraison, $adresse1_livraison, $adresse2_livraison, $ville_livraison];

        $mot_apres_echappement = [];
        $liste_valeurs_echappees = [];
        
        foreach($liste_valeurs_a_echapper as $valeur_a_echapper)
        {
            $mot_apres_echappement = str_replace("'", "''", $valeur_a_echapper);

            array_push($liste_valeurs_echappees, $mot_apres_echappement);
            $mot_apres_echappement = [];
        }

        $reference_commande_encode = mb_convert_encoding($liste_valeurs_echappees[0], "iso-8859-1", "UTF-8");
        $commentaire_commande_encode = mb_convert_encoding($liste_valeurs_echappees[1], "iso-8859-1", "UTF-8");
        $nom_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[2], "iso-8859-1", "UTF-8");
        $prenom_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[3], "iso-8859-1", "UTF-8");
        $adresse1_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[4], "iso-8859-1", "UTF-8");
        $adresse2_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[5], "iso-8859-1", "UTF-8");
        $ville_livraison_encode = mb_convert_encoding($liste_valeurs_echappees[6], "iso-8859-1", "UTF-8");

        $sql = "UPDATE FILCOMSOD.ENTSODP1 SET CENOML = '$nom_livraison_encode', SONOML = '$prenom_livraison_encode', SOTELL = '$telephone_livraison', 
        CEAD1L = '$adresse1_livraison_encode', CEAD2L = '$adresse2_livraison_encode', CEPOSL = '$code_postal_livraison', CELVIL = '$ville_livraison_encode', 
        SOMAIL = '$email_livraison', SOTEL2 = '$telephone_livraison', SOTYPO = '$type_commande', SOCOMM = '$commentaire_commande_encode', CECREF = '$reference_commande_encode' 
        WHERE SONCDE = '$numero_commande'";

        odbc_Exec($conn, $sql);

        $reponse = [
            'numero_commande' => $numero_commande,
            'nom_livraison' => utf8_encode($nom_livraison),
            'prenom_livraison' => utf8_encode($prenom_livraison),
            'telephone_livraison' => $telephone_livraison,
            'adresse1_livraison' => utf8_encode($adresse1_livraison),
            'adresse2_livraison' => utf8_encode($adresse2_livraison),
            'code_postal_livraison' => $code_postal_livraison,
            'ville_livraison' => utf8_encode($ville_livraison),
            'mail_livraison' => $email_livraison,
            'reference_commande' => utf8_encode($reference_commande),
            'type_commande' => $type_commande,
            'commentaire_commande' => utf8_encode($commentaire_commande)
        ];

        return $reponse;
    }

    //prend en paramètre le numéro de commande et le dossier client et retourne les informations de facturation, de livraison et l'entête de la commande
    public function detail_client_modification(Request $request)
    {   
        include '../../include/connexion.php';

        $donnees = array_values($request->all());

        $numero_commande = $donnees[0];
        $dossier = $donnees[1];

        $sql = "SELECT CENOMF, SOMAIF, SOAD1F, SOAD2F, SOPOSF, SOLVIF, SOTELF, CENOML, SONOML, SOTELL, CEAD1L, CEAD2L, CEPOSL, CELVIL, SOMAIL, SOCOMM, SOTYPO, CECREF FROM 
        FILCOMSOD.ENTSODP1 WHERE SODOSS = '$dossier' AND SONCDE = '$numero_commande'";

        $resultat = odbc_Exec($conn, $sql);

        $nom_facture = utf8_encode(trim(odbc_result($resultat, 'CENOMF')));
        $telephone_facture = trim(odbc_result($resultat, 'SOTELF'));
        $mail_facture = trim(odbc_result($resultat, 'SOMAIF'));
        $adresse1_facture = utf8_encode(trim(odbc_result($resultat, 'SOAD1F')));
        $adresse2_facture = utf8_encode(trim(odbc_result($resultat, 'SOAD2F')));
        $code_postal_facture = trim(odbc_result($resultat, 'SOPOSF'));
        $ville_facture = utf8_encode(trim(odbc_result($resultat, 'SOLVIF')));
        $nom_livraison = utf8_encode(trim(odbc_result($resultat, 'CENOML')));
        $prenom_livraison = utf8_encode(trim(odbc_result($resultat, 'SONOML')));
        $telephone_livraison = trim(odbc_result($resultat, 'SOTELL'));
        $mail_livraison = trim(odbc_result($resultat, 'SOMAIL'));
        $adresse1_livraison = utf8_encode(trim(odbc_result($resultat, 'CEAD1L')));
        $adresse2_livraison = utf8_encode(trim(odbc_result($resultat, 'CEAD2L')));
        $code_postal_livraison = trim(odbc_result($resultat, 'CEPOSL'));
        $ville_livraison = utf8_encode(trim(odbc_result($resultat, 'CELVIL')));
        $reference_commande = utf8_encode(trim(odbc_result($resultat, 'CECREF')));
        $type_commande = trim(odbc_result($resultat, 'SOTYPO'));
        $commentaire_commande = utf8_encode(trim(odbc_result($resultat, 'SOCOMM')));

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

    //prend en parametre le numéro de commande et l'envoie au serveur avec l'email du représentant pour qu'il puisse envoyer un mail quand
    // une commande est cloturé
    public function envoyer_email_cloture(Request $request)
    {
        include '../../include/connexion.php';
        $donnees = array_values($request->all());
        $numero_commande = $donnees[0];

        $recuperer_code_representant = "SELECT SONREP FROM FILCOMSOD.ENTSODP1 WHERE SONCDE = '$numero_commande'";

        $resultat_code_representant = odbc_Exec($conn, $recuperer_code_representant);
        $code_representant = trim(odbc_result($resultat_code_representant, 'SONREP'));

        $recuperer_email_representant = "SELECT SRADR2 FROM FILCOMSOD.REPFICP1 WHERE SRCREP = '$code_representant'";

        $resultat_email_representant = odbc_exec($conn, $recuperer_email_representant);
        $email_representant = trim(odbc_result($resultat_email_representant, 'SRADR2'));

        $parametre2 = str_repeat('0', 9 - strlen($numero_commande)) . $numero_commande;
        $requete = "SBMJOB CMD(CALL PGM(SODJF/JFTM110) PARM(''" . $email_representant . "'' ''" . $parametre2 . "'' '''' ''000001''))";
        $taille_requete = strlen($requete) - 8;
        $taille_requete = str_pad($taille_requete, 10, '0', STR_PAD_LEFT);
        $executer_requete = odbc_exec($conn, "CALL QSYS.QCMDEXC('" . $requete . "'," . $taille_requete . ".00000)");

        $affichageJson = [
            'donnees' => $donnees,
            'numero_commande' => $numero_commande,
            'code_representant' => $code_representant,
            'email_representant' => $email_representant,
            'requete' => $requete
        ];

        return $affichageJson;
    }

    //récupère les informations des commandes d'un représentant, la clé d'un représentant étant fournie en paramètre
    //récupère toutes les commandes de tous les représentants si la requête viens d'un membre de la direction
    public function obtenir_liste_commandes($cle_representant, Request $request)
    {
        include '../../include/connexion.php';

        $donnees = array_values($request->all());
        $direction = $donnees[0];
        $total = [];

        if($direction == "true")
        {
            $sql = "SELECT SONCDE, CECREF, SOTYPO, SODATE, SOCTRA, CENOMF, CENOML, SOVALI, SODOSS, SOAD1F, SOPOSF, SOLVIF, CEAD1L, CEAD2L, CEPOSL, CELVIL, SONREP
            FROM FILCOMSOD.ENTSODP1 WHERE SOCTRA <> 'LIVRAISON' AND SOCTRA <> 'DROPSHIPPING' AND SONREP <> ''";

            $commandes = odbc_Exec($conn, $sql);

            $toutes_les_commandes = [];

            while(odbc_fetch_row($commandes)) 
            {
                $numero_commande = trim(odbc_result($commandes, 'SONCDE'));
                $reference_commande = utf8_encode(trim(odbc_result($commandes, 'CECREF')));
                $type_commande = trim(odbc_result($commandes, 'SOTYPO'));
                $date_commande = trim(odbc_result($commandes, 'SODATE'));
                $cloture_commande = trim(odbc_result($commandes, 'SOCTRA'));
                $nom_client = utf8_encode(trim(odbc_result($commandes, 'CENOMF')));
                $nom_livraison = utf8_encode(trim(odbc_result($commandes, 'CENOML')));
                $sovali = trim(odbc_result($commandes, 'SOVALI'));
                $dossier = trim(odbc_result($commandes, 'SODOSS'));
                $adresse_facture = utf8_encode(trim(odbc_result($commandes, 'SOAD1F')));
                $code_postal_facture = trim(odbc_result($commandes, 'SOPOSF'));
                $ville_facture = utf8_encode(trim(odbc_result($commandes, 'SOLVIF')));
                $adresse_livraison = utf8_encode(trim(odbc_result($commandes, 'CEAD1L')));
                $complement_livraison = utf8_encode(trim(odbc_result($commandes, 'CEAD2L')));
                $code_postal_livraison = trim(odbc_result($commandes, 'CEPOSL'));
                $ville_livraison = utf8_encode(trim(odbc_result($commandes, 'CELVIL')));
                $code_representant = utf8_encode(trim(odbc_result($commandes, 'SONREP')));

                $recuperer_nom_representant = "SELECT SRNOML FROM REPFICP1 WHERE SRSOCI = '03' AND SRCREP = '$code_representant'";

                $representant = odbc_exec($conn, $recuperer_nom_representant);

                $nom_representant = utf8_encode(trim(odbc_result($representant, 'SRNOML')));

                $recuperer_total_commande = "SELECT LOQTEE, LOPRIX FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$numero_commande'";

                $resultat = odbc_exec($conn, $recuperer_total_commande);

                while(odbc_fetch_row($resultat))
                {
                    $prix_unitaire = trim(odbc_result($resultat, 'LOQTEE'));
                    $quantite = trim(odbc_result($resultat, 'LOPRIX'));
                    array_push($total, $prix_unitaire * $quantite);
                }

                $affichageJson = [
                    'numero_commande' => $numero_commande,
                    'reference_commande' => $reference_commande,
                    'type_commande' => $type_commande,
                    'date_commande' => $date_commande,
                    'cloture_commande' => $cloture_commande,
                    'ventiler_commande' => $sovali,
                    'nom_client' => $nom_client,
                    'nom_client_livraison' => $nom_livraison,
                    'dossier' => $dossier,
                    'adresse_facture' => $adresse_facture,
                    'code_postal_facture' => $code_postal_facture,
                    'ville_facture' => $ville_facture,
                    'adresse_livraison' => $adresse_livraison,
                    'complement_livraison' => $complement_livraison,
                    'code_postal_livraison' => $code_postal_livraison,
                    'ville_livraison' => $ville_livraison,
                    'nom_representant' => $nom_representant,
                    'total' => array_sum($total)
                ];

                $total = [];
                array_push($toutes_les_commandes, $affichageJson);
            }
        }

        else
        {
            $sql = "SELECT SONCDE, CECREF, SOTYPO, SODATE, SOCTRA, CENOMF, CENOML, SOVALI, SODOSS, SOAD1F, SOPOSF, SOLVIF, CEAD1L, CEAD2L, CEPOSL, CELVIL
            FROM FILCOMSOD.ENTSODP1 WHERE SOCLEE = '$cle_representant' AND SOCTRA <> 'LIVRAISON'";
            
            $commandes = odbc_Exec($conn, $sql);

            $toutes_les_commandes = [];

            while(odbc_fetch_row($commandes)) 
            {
                $numero_commande = trim(odbc_result($commandes, 'SONCDE'));
                $reference_commande = utf8_encode(trim(odbc_result($commandes, 'CECREF')));
                $type_commande = trim(odbc_result($commandes, 'SOTYPO'));
                $date_commande = trim(odbc_result($commandes, 'SODATE'));
                $cloture_commande = trim(odbc_result($commandes, 'SOCTRA'));
                $nom_client = utf8_encode(trim(odbc_result($commandes, 'CENOMF')));
                $nom_livraison = utf8_encode(trim(odbc_result($commandes, 'CENOML')));
                $sovali = trim(odbc_result($commandes, 'SOVALI'));
                $dossier = trim(odbc_result($commandes, 'SODOSS'));
                $adresse_facture = utf8_encode(trim(odbc_result($commandes, 'SOAD1F')));
                $code_postal_facture = trim(odbc_result($commandes, 'SOPOSF'));
                $ville_facture = utf8_encode(trim(odbc_result($commandes, 'SOLVIF')));
                $adresse_livraison = utf8_encode(trim(odbc_result($commandes, 'CEAD1L')));
                $complement_livraison = utf8_encode(trim(odbc_result($commandes, 'CEAD2L')));
                $code_postal_livraison = trim(odbc_result($commandes, 'CEPOSL'));
                $ville_livraison = utf8_encode(trim(odbc_result($commandes, 'CELVIL')));

                $recuperer_total_commande = "SELECT LOQTEE, LOPRIX FROM FILCOMSOD.LIGSODP1 WHERE LONCDE = '$numero_commande'";

                $resultat = odbc_exec($conn, $recuperer_total_commande);

                while(odbc_fetch_row($resultat))
                {
                    $prix_unitaire = trim(odbc_result($resultat, 'LOQTEE'));
                    $quantite = trim(odbc_result($resultat, 'LOPRIX'));
                    array_push($total, $prix_unitaire * $quantite);
                }

                $affichageJson = [
                    'numero_commande' => $numero_commande,
                    'reference_commande' => $reference_commande,
                    'type_commande' => $type_commande,
                    'date_commande' => $date_commande,
                    'cloture_commande' => $cloture_commande,
                    'ventiler_commande' => $sovali,
                    'nom_client' => $nom_client,
                    'nom_client_livraison' => $nom_livraison,
                    'dossier' => $dossier,
                    'adresse_facture' => $adresse_facture,
                    'code_postal_facture' => $code_postal_facture,
                    'ville_facture' => $ville_facture,
                    'adresse_livraison' => $adresse_livraison,
                    'complement_livraison' => $complement_livraison,
                    'code_postal_livraison' => $code_postal_livraison,
                    'ville_livraison' => $ville_livraison,
                    'total' => array_sum($total)
                ];

                $total = [];
                array_push($toutes_les_commandes, $affichageJson);
            }
        }

        return $toutes_les_commandes;
    }
}

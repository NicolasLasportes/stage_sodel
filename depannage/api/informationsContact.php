<?php
    include "../../include/connexion.php";
    include "functions.php";
    header("Content-Type: application/json; charset=UTF-8");

    $numeroClient = $_POST['numeroClient'];
    $numeroProforma = $_POST['numeroProforma'];

    $sql = "SELECT TIINTR, TITELE FROM FILCOMSOD.TIEWEBP1 WHERE TINCLI = '$numeroClient'";
    $resultat = odbc_Exec($conn, $sql);
    
    $nomContact = trim(odbc_result($resultat, 'TIINTR'));
    $telephoneContact = trim(odbc_result($resultat, "TITELE")); 
    
    $requeteInformationsSuiviProforma = "SELECT SUDATD, SUDATP, SUCOMM, SUDATC, SUDATA, SUCOMA, SUCOMC FROM FILWEBSOD.SUIPRFP1 WHERE SUNCDE = '$numeroProforma'";
    $resultatInformationsSuiviProforma = odbc_Exec($conn, $requeteInformationsSuiviProforma);
    
    $derniereModification = trim(odbc_result($resultatInformationsSuiviProforma, 'SUDATD'));
    $prochaineAction = trim(odbc_result($resultatInformationsSuiviProforma, "SUDATP"));    
    $commentaire = trim(mb_convert_encoding(odbc_result($resultatInformationsSuiviProforma, 'SUCOMM'), "UTF-8", "ISO-8859-1"));
    $cloture = echappementChaineCaracteres(trim(odbc_result($resultatInformationsSuiviProforma, "SUDATC")));    
    $archive = trim(odbc_result($resultatInformationsSuiviProforma, 'SUDATA'));
    $commentaireArchive = trim(mb_convert_encoding(odbc_result($resultatInformationsSuiviProforma, "SUCOMA"), "UTF-8", "ISO-8859-1"));
    $commentaireCloture = echappementChaineCaracteres(trim(mb_convert_encoding(odbc_result($resultatInformationsSuiviProforma, "SUCOMC"),"UTF-8", "ISO-8859-1")));
    
    $informationsClient = [
        "nomContact" => $nomContact,
        "telephoneContact" => $telephoneContact,
        "derniereModification" => $derniereModification,
        "prochaineAction" => $prochaineAction,
        "commentaire" => $commentaire,
        "cloture" => $cloture,
        "archive" => $archive,
        "commentaireArchive" => $commentaireArchive,
        "commentaireCloture" => $commentaireCloture
    ];

    echo json_encode($informationsClient);
?>
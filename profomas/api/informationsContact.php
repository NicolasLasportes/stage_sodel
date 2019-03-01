<?php
    include "../include/connexion.php";
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
    $commentaire = trim(odbc_result($resultatInformationsSuiviProforma, 'SUCOMM'));
    $cloture = trim(odbc_result($resultatInformationsSuiviProforma, "SUDATC"));    
    $archive = trim(odbc_result($resultatInformationsSuiviProforma, 'SUDATA'));
    $commentaireArchive = trim(odbc_result($resultatInformationsSuiviProforma, "SUCOMA"));
    $commentaireCloture = trim(odbc_result($resultatInformationsSuiviProforma, "SUCOMC"));
    
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
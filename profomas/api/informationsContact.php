<?php
    include "../include/connexion.php";
    header("Content-Type: application/json; charset=UTF-8");

    $dossierClient = $_POST['dossier'];
    $sql = "SELECT TITNOM, TITELE FROM FILCOMSOD.TIEWEBP1 WHERE DOSSIER = '$dossierClient'";
    $resultat = odbc_Exec($conn, $sql);
    $nomContact = trim(odbc_result($resultat, 'TITNOM'));
    $telephoneContact = trim(odbc_result($resultat, "TITELE")); 
    $informationsClient = [
        "nomClient" => $nomContact,
        "telephoneContact" => $telephoneContact
    ];

    echo json_encode($informationsClient);
?>
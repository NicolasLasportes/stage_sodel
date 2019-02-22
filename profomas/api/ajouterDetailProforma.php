<?php
    include '../include/connexion.php' ;
    //header("Content-Type: application/json; charset=UTF-8");

    // $codeSociete = $_POST['codeSociete'];
    // $numeroClient = $_POST['numeroClient'];
    // $numeroProforma = $_POST['numeroProforma'];
    // $codeUtilisateur = $_POST['codeUtilisateur'];
    // $dateDerniereModification = $_POST['dateDerniereModification'];
    // $dateProchaineAction = $_POST['dateProchaineAction'];
    // $commentaire = $_POST['commentaire'];
    // $dateCloture = $_POST['dateCloture'];
    // $dateArchive = $_POST['dateArchive'];
    // $commentaireCloture = $_POST['commentaireCloture'];
    // $commentaireArchive = $_POST['commentaireArchive'];
    $ajouterOuModifier = true;

    if($ajouterOuModifier == true)
    {
        $requeteAjouterSuiviProforma = "INSERT INTO FILWEBSOD.SUIPRFP1 VALUES ('03', '213', '123', '', 
        '01-02-2019', '01-02-2019', 'razerza', '01-02-2019', '01-02-2019', 'zrearez', 'zaeraze');";
        odbc_Exec($conn, $requeteAjouterSuiviProforma);
        
        $reponse = [
            "reponse" => "suivi proforma ajouté !",
            "sql" => $requeteAjouterSuiviProforma
        ];
    
        echo json_encode($reponse);
    }

    else
    {
        $requeteModifierSuiviProforma = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '$dateDerniereModification', SUDATP = '$dateProchaineAction', 
        SUCOMM = '$commentaire', SUDATC = '$dateCloture', SUDATA = '$dateArchive', SUCOMC = '$commentaireCloture', SUCOMA = '$commentaireArchive'
        WHERE SUNCDE = '$numeroProforma' AND SUSOCI = '$codeSociete' AND SUNTIE = '$numeroClient');";
        $resultatAjouterSuiviProforma = odbc_Exec($conn, $requeteModifierSuiviProforma);
    
        $reponse = [
            "reponse" => "suivi proforma mis à jour !",
            "sql" => $requeteModifierSuiviProforma
        ];
    
        echo json_encode($reponse);
    }

?>
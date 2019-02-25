<?php
    include '../include/connexion.php';
    header("Content-Type: application/json; charset=UTF-8");

    $codeSociete = $_POST['codeSociete'];
    $numeroClient = $_POST['numeroClient'];
    $numeroProforma = $_POST['numeroProforma'];
    $codeUtilisateur = '';
    $dateDerniereModification = $_POST['dateDerniereModification'];
    $dateProchaineAction = $_POST['dateProchaineAction'];
    $commentaire = $_POST['commentaire'];
    $dateCloture = $_POST['dateCloture'];
    $dateArchive = $_POST['dateArchive'];
    $commentaireCloture = $_POST['commentaireCloture'];
    $commentaireArchive = $_POST['commentaireArchive'];
    $numeroProforma = $_POST['numeroProforma'];
    $ajouterOuModifier = $_POST['ajouterOuModifier'];

    if($ajouterOuModifier == "true")
    {
        $requeteAjouterSuiviProforma = "INSERT INTO FILWEBSOD.SUIPRFP1 VALUES ('$codeSociete', '$numeroProforma', '$numeroClient', '$codeUtilisateur', 
        '$dateDerniereModification', '$dateProchaineAction', '$commentaire', '$dateCloture', '$dateArchive', '$commentaireCloture', '$commentaireArchive')";
        $resultatAjouterSuiviProforma = odbc_Exec($conn, $requeteAjouterSuiviProforma);
        
        $reponse = [
            "reponse" => "suivi proforma ajouté !"
            
        ];
    
        echo json_encode($reponse);
    }

    else
    {
        $requeteModifierSuiviProforma = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '$dateDerniereModification', SUDATP = '$dateProchaineAction', 
        SUCOMM = '$commentaire', SUDATC = '$dateCloture', SUDATA = '$dateArchive', SUCOMC = '$commentaireCloture', SUCOMA = '$commentaireArchive'
        WHERE SUNCDE = '$numeroProforma'";
        $resultatAjouterSuiviProforma = odbc_Exec($conn, $requeteModifierSuiviProforma);
    
        $reponse = [
            "reponse" => "suivi proforma mis à jour !"
        ];
    
        echo json_encode($reponse);
    }
?>


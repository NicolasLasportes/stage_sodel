<?php
    include '../include/connexion.php';
    header("Content-Type: application/json; charset=UTF-8");

    $codeSociete = $_POST['codeSociete'];
    $numeroClient = $_POST['numeroClient'];
    $numeroProforma = $_POST['numeroProforma'];
    $codeUtilisateur = '';
    $dateDerniereModification = $_POST['dateDerniereModification'];
    $dateProchaineAction = $_POST['dateProchaineAction'];
    $commentaire = mb_convert_encoding($_POST['commentaire'], "ISO-8859-1", "UTF-8");
    $dateCloture = $_POST['dateCloture'];
    $dateArchive = $_POST['dateArchive'];
    $commentaireCloture = mb_convert_encoding($_POST['commentaireCloture'], "ISO-8859-1", "UTF-8");
    $commentaireArchive = mb_convert_encoding($_POST['commentaireArchive'], "ISO-8859-1", "UTF-8");
    $numeroProforma = $_POST['numeroProforma'];
    $ajouterOuModifier = $_POST['ajouterOuModifier'];

    if($ajouterOuModifier == "true")
    {
        if($commentaire === "")
        {
            $requeteAjouterSuiviProforma = "INSERT INTO FILWEBSOD.SUIPRFP1 VALUES ('$codeSociete', '$numeroProforma', '$numeroClient', '$codeUtilisateur', 
            '$dateDerniereModification', '$dateProchaineAction', '', '$dateCloture', '$dateArchive', '$commentaireCloture', '$commentaireArchive')";
        }
        else
        {
            $requeteAjouterSuiviProforma = "INSERT INTO FILWEBSOD.SUIPRFP1 VALUES ('$codeSociete', '$numeroProforma', '$numeroClient', '$codeUtilisateur', 
            '$dateDerniereModification', '$dateProchaineAction', '$commentaire', '$dateCloture', '$dateArchive', '$commentaireCloture', '$commentaireArchive')";
        }
        
        $resultatAjouterSuiviProforma = odbc_Exec($conn, $requeteAjouterSuiviProforma);
        
        $reponse = [
            "reponse" => "suivi proforma ajouté !"
        ];
    
        echo json_encode($reponse);
    }

    else
    {
        if($commentaire === "")
        {
            $requeteModifierSuiviProforma = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '$dateDerniereModification', SUDATP = '$dateProchaineAction', 
            SUDATC = '$dateCloture', SUDATA = '$dateArchive', SUCOMC = '$commentaireCloture', SUCOMA = '$commentaireArchive' WHERE SUNCDE = '$numeroProforma'";
        }
        else
        {
            $requeteModifierSuiviProforma = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '$dateDerniereModification', SUDATP = '$dateProchaineAction', 
            SUCOMM = '$commentaire', SUDATC = '$dateCloture', SUDATA = '$dateArchive', SUCOMC = '$commentaireCloture', SUCOMA = '$commentaireArchive'
            WHERE SUNCDE = '$numeroProforma'";
        }

        $resultatAjouterSuiviProforma = odbc_Exec($conn, $requeteModifierSuiviProforma);
    
        $reponse = [
            "reponse" => "suivi proforma mis à jour !"
        ];
    
        echo json_encode($reponse);
    }
?>
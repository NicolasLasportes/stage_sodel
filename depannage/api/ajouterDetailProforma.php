<?php
    include '../../include/connexion.php';
    include 'functions.php';
    //header("Content-Type: application/json; charset=UTF-8");

    $codeSociete = "03";//$_POST['codeSociete'];
    $numeroClient = "38";//$_POST['numeroClient'];
    $numeroProforma = "237689";//$_POST['numeroProforma'];
    $codeUtilisateur = '';
    $dateDerniereModification = "2019-01-01";//$_POST['dateDerniereModification'];
    $dateProchaineAction = "";//$_POST['dateProchaineAction'];
    $commentaire = echappementChaineCaracteres("( Enreg : 2019-03-04) un blabla  essai avec d\es ");//, "ISO-8859-1", "UTF-8");
    $dateCloture = "2019-03-04";//$_POST['dateCloture'];
    $dateArchive = "";//$_POST['dateArchive'];
    $commentaireCloture = echappementChaineCaracteres("je met des ' dans mon commentaire");//, "ISO-8859-1", "UTF-8");
    $commentaireArchive = "";//mb_convert_encoding(addslashes($_POST['commentaireArchive']), "ISO-8859-1", "UTF-8");
    $ajouterOuModifier = "false";//$_POST['ajouterOuModifier'];

    echo $commentaire . "<br>" . $commentaireCloture;
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
        
       odbc_Exec($conn, $requeteAjouterSuiviProforma);
        
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

        odbc_Exec($conn, $requeteModifierSuiviProforma);
    
        $reponse = [
            "reponse" => "suivi proforma mis à jour !",
            "sql" => $requeteModifierSuiviProforma
        ];
    
        echo json_encode($reponse);
    }
?>
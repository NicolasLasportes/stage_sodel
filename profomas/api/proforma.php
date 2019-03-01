<?php
    include '../include/connexion.php';
    header("Content-Type: application/json; charset=UTF-8");
    $cl = $_GET['cl'];
    $ID = $_GET['ID'];
    $intitule = $_GET['intitule'];
    $direction = $_POST['direction'];
    $dateLimite = $_POST['dateLimite'];

    // Ecriture Log
    $adresse_ip=$_SERVER['REMOTE_ADDR'];
    $today = date("d-m-Y H:i:s");
    $TypeDoc = "Mes dernières Proformas" ;
    $zone = $today.";".$intitule.";".$TypeDoc.";".$adresse_ip.PHP_EOL;
    $monfic = "../logs/historique.txt";
    $f=fopen($monfic, 'a');
    fwrite($f, $zone);
    $listeProformas = [];

    if($direction == "&code=T")
    {
        $sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM FILCOMSOD.ENTPRFP2 
        WHERE CESOCI <> '35' AND PRDCDE >= '$dateLimite' ORDER by PRDCDE desc";
    }
    else
    {
        $sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM FILCOMSOD.ENTPRFP2
        WHERE PRREPR = '$ID' AND PRCLEE = '$cl' AND PRDCDE >= '$dateLimite' ORDER by PRDCDE desc";
    }
    
    $result = odbc_Exec($conn, $sql);

	while (odbc_fetch_row($result)) 
	{
		$PRREPR = odbc_result($result, "PRREPR"); 
		$CESOCI = odbc_result($result, "CESOCI"); 
		$CENTIE = odbc_result($result, "CENTIE"); 
		$PRLIE2 = odbc_result($result, "PRLIE2"); 
		$PRRAIS = odbc_result($result, "PRRAIS"); 
		$CETYC = odbc_result($result, "CE\$TYC"); 
		$PRLIE1 = odbc_result($result, "PRLIE1"); 
		$CENCDE = odbc_result($result, "CENCDE"); 
		$CETHTI = odbc_result($result, "CETHTI"); 
		$CETTTI = odbc_result($result, "CETTTI"); 
		$CECREF = odbc_result($result, "CECREF"); 
		$PRDCDE = date_create(odbc_result($result, "PRDCDE"));

        if($direction == "&code=T")
        {
            $recupererDetailProforma = "SELECT SUDATD, SUDATP, SUCOMM, SUDATC, SUDATA, SUCOMC, SUCOMA FROM FILWEBSOD.SUIPRFP1 WHERE SUSOCI = '$CESOCI' 
            AND SUNCDE = '$CENCDE' FETCH FIRST 1 ROWS ONLY";
        }
        else
        {
            $recupererDetailProforma = "SELECT SUDATD, SUDATP, SUCOMM, SUDATC, SUDATA, SUCOMC, SUCOMA FROM FILWEBSOD.SUIPRFP1 WHERE SUSOCI = '$CESOCI' 
            AND SUNCDE = '$CENCDE' AND ( SUDATA = '0001-01-01' OR SUDATA = '') FETCH FIRST 1 ROWS ONLY";
        }

		$resultatDetailProforma = odbc_Exec($conn, $recupererDetailProforma);
        
		$archiver = trim(odbc_result($resultatDetailProforma, "SUDATA"));
		$cloturer = trim(odbc_result($resultatDetailProforma, "SUDATC"));
		$prochaineAction = trim(odbc_result($resultatDetailProforma, "SUDATP"));
		$derniereModification = trim(odbc_result($resultatDetailProforma, "SUDATD"));
        $commentaire = trim(odbc_result($resultatDetailProforma, "SUCOMM"));
        $commentaireCloture = trim(odbc_result($resultatDetailProforma, "SUCOMC"));

        if($direction != "&code=T" && $cloturer == "0001-01-01" || $direction != "&code=T" && $cloturer == "" ||$direction != "&code=T" && $cloturer == "false" || $direction =="&code=T")
        {
            if($archiver == "0001-01-01" || $archiver == "" || $archiver == false )
            {
                $affichageJson = [
                    "numeroRepresentant" => $PRREPR,
                    "codeSociete" => $CESOCI,
                    "numeroClient" => $CENTIE,
                    "raisonSociale" => utf8_encode($PRRAIS),
                    "type" => $CETYC,
                    "lienPdf" => $PRLIE1,
                    "lienClient" => $PRLIE2,
                    "numeroProforma" => $CENCDE,
                    "horsTaxes" => $CETHTI,
                    "total" => $CETTTI,
                    "reference" => utf8_encode($CECREF),
                    "archive" => $archiver,
                    "cloture" => $cloturer,
                    "dateCreation" => $PRDCDE,
                    "prochaineAction" => $prochaineAction,
                    "derniereModification" => $derniereModification,
                    "commentaire" => $commentaire,
                    "commentaireCloture" => $commentaireCloture
                ];
                array_push($listeProformas, $affichageJson);
            }
        }

    }
    echo json_encode($listeProformas);
?>
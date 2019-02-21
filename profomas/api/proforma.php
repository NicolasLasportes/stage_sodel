<?php
    header("Content-Type: application/json; charset=UTF-8");

    include '../include/connexion.php' ;
    $cl = $_GET['cl'] ;
    $ID = $_GET['ID'] ;
    $intitule = $_GET['intitule'] ;
    $jourspasses = 0 ; 
    // Ecriture Log
    $adresse_ip=$_SERVER['REMOTE_ADDR'];
    $today = date("d-m-Y H:i:s");
    $TypeDoc = "Mes dernières Proformas" ;
    $zone = $today.";".$intitule.";".$TypeDoc.";".$adresse_ip.PHP_EOL;
    $monfic = "../logs/historique.txt";
    $f=fopen($monfic, 'a');
    fwrite($f, $zone);
    $listeProformas = [];

    $sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM FILCOMSOD.ENTPRFP2
	WHERE PRREPR = '$ID' and PRCLEE = '$cl' ORDER by PRDCDE desc" ;
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

		// $recupererDetailProforma = "SELECT SUDATD, SUDATP, SUCOMM, SUDATC, SUDATA, SUCOMC, SUCOMA FROM FILWEBSOD.SUIPRFP1 WHERE SUSOCI = '$CESOCI' 
        // AND SUNCDE = '$CENCDE'";
		// $resultatDetailProforma = odbc_Exec($conn, $recupererDetailProforma);

		// $archiver = odbc_result($resultatDetailProforma, "SUDATA");
		// $cloturer = odbc_result($resultatDetailProforma, "SUDATC");
		// $prochaineAction = odbc_result($resultatDetailProforma, "SUDATP");
		// $derniereModification = odbc_result($resultatDetailProforma, "SUDATD");
        // $commentaire = odbc_result($resultatDetailProforma, "SUCOMM");

        $affichageJson = [
            "numeroRepresentant" => $PRREPR,
            "codeSociete" => $CESOCI,
            "numeroClient" => $CENTIE,
            "raisonSociale" => $PRLIE2,
            "date" => $PRRAIS,
            "type" => $CETYC,
            "numeroProforma" => $PRLIE1,
            "horsTaxes" => $CENCDE,
            "reference" => $CETHTI
            // "archive" => $archiver,
            // "cloture" => $cloturer,
            // "dateCree" => $PRDCDE,
            // "prochaineAction" => $prochaineAction,
            // "derniereModification" => $derniereModification,
            // "commentaire" => $commentaire
        ];
        array_push($listeProformas, $affichageJson);
    }
    
    echo json_encode($listeProformas);
?>
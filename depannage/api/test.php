<?php
    include '../include/connexion.php' ;
    header("Content-Type: application/json; charset=UTF-8");

    $affichage = [];
    $requete = "DELETE FROM FILWEBSOD.SUIPRFP1";
    // $requete = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '2019-02-10', SUDATP = '2019-03-10', SUCOMM = 'bonjour a tous ', SUDATC = '0001-01-01', SUDATA = '0001-01-01', 
    // SUCOMC = '', SUCOMA = '' WHERE SUNCDE = '235873'";
    odbc_Exec($conn, $requete);
    
    $sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM FILCOMSOD.ENTPRFP2 
    WHERE PRREPR = '035' and PRCLEE = 'morekze2sd3sdd6' AND PRDCDE >= '2019-02-28' ORDER by PRDCDE desc";

    $resultat = odbc_Exec($conn, $sql);
    while(odbc_fetch_row($resultat))
    {
        $PRREPR = odbc_result($resultat, "PRREPR"); 
		$CESOCI = odbc_result($resultat, "CESOCI"); 
		$CENTIE = odbc_result($resultat, "CENTIE"); 
		$PRLIE2 = odbc_result($resultat, "PRLIE2"); 
		$PRRAIS = odbc_result($resultat, "PRRAIS"); 
		$CETYC = odbc_result($resultat, "CE\$TYC"); 
		$PRLIE1 = odbc_result($resultat, "PRLIE1"); 
		$CENCDE = odbc_result($resultat, "CENCDE"); 
		$CETHTI = odbc_result($resultat, "CETHTI"); 
		$CETTTI = odbc_result($resultat, "CETTTI"); 
		$CECREF = odbc_result($resultat, "CECREF"); 
		$PRDCDE = date_create(odbc_result($resultat, "PRDCDE"));

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
            "date" => $PRDCDE
        ];
        array_push($affichage, $affichageJson);

    }

    echo json_encode($affichage);
?>
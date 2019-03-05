<?php
include 'include/connexion.php' ;

$id = $_GET['ID'] ;
$intitule = $id ;
if (isset($_GET['intitule']))
	{
$intitule = $_GET['intitule'] ;
}


// Ecriture Log
$adresse_ip=$_SERVER['REMOTE_ADDR'];
$today = date("d-m-Y H:i:s");
$TypeDoc = "Commandes en cours" ;
$zone = $today.";".$intitule.";".$TypeDoc.";".$adresse_ip.PHP_EOL;
$monfic = "logs/historique.txt";
$f=fopen($monfic, 'a');
fwrite($f, $zone);

?>

<body bgcolor="#E1E1E1">


<html>
<head>
	<title>Mes commandes en cours</title>
	<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/resutatjou.css">
	<link rel="stylesheet" href="css/fontawesome/css/all.css">
	<meta name="viewport" content="width=device-width, maximum-scale=1, target-densitydpi=device-dpi">
	<meta charset="UTF-8">
</head>

<meta name="site-config-URL" content="http://127.0.0.1/">
<body>


<!-- D�but pour trie Javascript -->

<script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="Js/DataTable.js"></script>
<!-- <script type="text/javascript" src="Js/in.so.js"></script> -->
<script type="text/javascript" src="Js/resultatjou.js"></script>


<!-- Fin pour trie Javascript -->

	<div align="center">
		<p align="center">
		<img class="monacor" src="images/monacor_international_logo%5B1%5D.gif" >
		<img class="dune" src="/logo-dune.png" ></p>


		<font face="Arial,Helvetica,Geneva,Swiss,SunSans-Regular" size="5"><b><font color="blue"><button name="button"><font size = "6"><font color="blue">Commandes en portefeuille</button></font>&nbsp;<font size=1></br>&nbsp;</b></font></font></font></font>
		<!-- <p><img src="avert.gif" width="540" height="20"></p> -->

		<!--s�parateur de millier et decimal plus ordre d'affichage de la colonne date --> 
	<script type="text/javascript" language="javascript">
   $(document).ready(function() {
    $('#example').DataTable( {
		"order": [[ 4, "desc" ]], // utilis�e pour ordre d'affichage
        
		"language": {     		  // utlis�e pour s�parateur de millier et decimal
            "decimal": ",",
            "thousands": "."
        }

    } );
} );	

</script>
		<!-- Bouton Fermeture de la fen�tre -->
 <script type="text/javascript" language="javascript">

function twFermer() {
  window.close();
}
// Fin -->
</script>
<!-- Avec un bouton de formulaire -->
<div align="right">
<form>
<input type="image" src="/images/off.jpg" width="30" height="30" onclick="twFermer()">
</form></div>


		<table id="example" class="tablesorter" cellpadding="0" cellspacing="1" class="sort">
			<thead>
				<tr id="tr">
					<th id="tdHeader1" ><div align="center"><b><font size=2 >Rep</font></b></div></th>
					<th id="tdHeader2" ><div align="center"><b><font size=2 >Sté</font></b></div></th>
					<th id="tdHeader3" ><div align="center"><b><font size=2 >N Clt</font></b></div></th>
					<th id="tdHeader4" ><div align="center"><b><font size="2" >Raison sociale</font></b></div></th>
					<th id="tdHeader5" ><div align="center"><b><font size=2 >Date</font></b></div></th>
					<th id="tdHeader6" ><div align="center"><b><font size=2 >Type</font></b></div></th>
					<th id="tdHeader7" ><div align="center"><b><font size=2 >N° de pièce</font></b></div></th>
					<th id="tdHeader8" ><div align="center"><b><font size=2 >H.T</font></b></div></th>
					<th id="tdHeader9" ><div align="center"><b><font size=2 >T.T.C</font></b></div></th>
					<td id="tdHeader10" ><div align="left"><b><font size=2 >Référence</font></b></div></th>
				</tr>
			</thead>
			<tbody>
<?php
 if (strlen($id) == 15) {
			$sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM ENTJOUP1 WHERE PRCLEE = '$id' ORDER by PRDCDE desc" ;
			$result = odbc_Exec($conn, $sql);
}
 if (strlen($id) == 2 and $id <> '35') {
			$sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM ENTJOUP1 WHERE (CESOCI ='03' or CESOCI = '07') ORDER by PRDCDE desc" ;
			$result = odbc_Exec($conn, $sql);
}
 if (strlen($id) == 2 and $id == '35') {
			$sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM ENTJOUP1 WHERE CESOCI ='35' ORDER by PRDCDE desc" ;
			$result = odbc_Exec($conn, $sql);
}

	while (odbc_fetch_row($result)) 
		{
$PRREPR = odbc_result($result, "PRREPR"); 
$PRDCDE = date_create(odbc_result($result, "PRDCDE"));
$CESOCI = odbc_result($result, "CESOCI"); 
$CENTIE = odbc_result($result, "CENTIE"); 
$PRRAIS = odbc_result($result, "PRRAIS"); 
$CETYC = odbc_result($result, "CE\$TYC"); 
$CENCDE = odbc_result($result, "CENCDE"); 
$CETHTI = odbc_result($result, "CETHTI"); 
$CETTTI = odbc_result($result, "CETTTI"); 
$CECREF = odbc_result($result, "CECREF"); 
$PRLIE3 = odbc_result($result, "PRLIE3"); 
$PRDCDE = date_format($PRDCDE,"d/m/y");
$FPRDCDE = substr($PRDCDE,6,4)."/".substr($PRDCDE,3,2)."/".substr($PRDCDE,0,2);

?>

		
		 	 	<tr>
					<td id="tdBody1" ><div align="center"><font size=2 ><?php echo $PRREPR ; ?></font></div></td>
					<td class="codeSociete" id="tdBody2"><div align="center"><font size=2 ><?php echo $CESOCI ; ?></font></div></td>
					<td class="numeroClient" id="tdBody3"><div align="center"><font size=2 ><A Href="<?php echo $PRLIE3 ; ?>" target="_blank" style="color:blue"><?php echo $CENTIE ; ?></font></div></td>
					<td class="raisonSociale" id="tdBody4" ><div align="center"><font size=2 ><?php echo $PRRAIS ; ?>&nbsp;<i class='fas fa-search-plus fa-1x'></i></font></div></td>
					<td id="tdBody5"><div align="center"><font size=2 >20<?php echo  $FPRDCDE ?></font></div></td>
					<td id="tdBody6" ><div align="center"><font size=1 ><?php echo $CETYC ; ?></font></div></td>
					<td class="numeroOrdre" id="tdBody7"><div align="center"><font size=2 ><?php echo $CENCDE ; ?></font></div></td>
					<td id="tdBody8"><div align="center"><font size=2 ><?php echo number_format($CETHTI, 2,',', '.') ; ?></font></div></td>
					<td id="tdBody9"><div align="center"><font size=2 ><?php echo number_format($CETTTI, 2,',', '.') ; ?></font></div></td>
					<td id="tdBody10"><div align="left"><font size=2 ><?php echo $CECREF ; ?></font></div></td>
				</tr>
<?php
}
?>				
			</tbody>
		</table>

		<form action="resultatpro.asp" method="post" enctype="application/x-www-form-urlencoded">
        </form>
		<p></p>
	</div>
	<div align="left">
		
  <p>&nbsp;</p>
</div>

<!-- modale qui affiche le détail d'une commande ou d'une proforma -->
<div id="detailOrdre" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h2 id="entete">Détail ordre n°</h2>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<img src="images/fermer.png" alt="fermer" class="fermerModale">
				</button>
			</div>
			<div class="modal-body">
				<div class="container">
					<div class="form-group">
						<div id="affichageDetailOrdre">
							<table class="table" id="tableauDetailOrdre">
								<thead>
									<th>Référence</th>
									<th>Quantité</th>
									<th>Prix unitaire</th>
									<th>Total ligne</th>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
					<div class="form-group">
						<div id="total"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

</body>
</html>
<?php
include 'include/connexion.php' ;

$cl = $_GET['cl'] ;
$ID = $_GET['ID'] ;
$intitule = $_GET['intitule'] ;
$jourspasses = 0 ; 
// Ecriture Log
$adresse_ip=$_SERVER['REMOTE_ADDR'];
$today = date("d-m-Y H:i:s");
$TypeDoc = "Mes dernières Proformas" ;
$zone = $today.";".$intitule.";".$TypeDoc.";".$adresse_ip.PHP_EOL;
$monfic = "logs/historique.txt";
$f=fopen($monfic, 'a');
fwrite($f, $zone);
?>

<html>
	<head>
		<title>Consultation Pro-formas</title>
		<link rel="stylesheet" type="text/css" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="css/resultatpro.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<meta name="viewport" content="width=device-width, maximum-scale=1, target-densitydpi=device-dpi">
		<meta charset="UTF-8">
		<meta name="site-config-URL" content="http://127.0.0.1/">
	</head>

	<body>

		<!-- Début pour trie Javascript -->

		<script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
		<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="Js/DataTable.js"></script> <!-- //cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js modifier pour le site -->
		<script type="text/javascript" src="Js/resultatPro.js"></script>
		<!-- inversion entre séparateur de millier et décimal -->
		<script type="text/javascript"> 
			$(document).ready(function() 
			{
				$('#example').DataTable( 
				{
						"language": 
						{
								"decimal": ",",
								"thousands": "."
						}
				});
			});
		</script>
		<!-- Fin pour trie Javascript -->

		<div align="center">
			<p align="center">
				<img class="monacor" src="images/monacor_international_logo%5B1%5D.gif">
				<img class="dune" src="/logo-dune.png">
			</p>
		
		<!-- Bouton Fermeture de la fenêtre -->
		<script type="text/javascript" language="javascript">
		// Début
			function twFermer() {
				window.close();
			}
		// Fin -->
		</script>

<font face="Arial,Helvetica,Geneva,Swiss,SunSans-Regular" size="5">
	<b>
		<button name="button">
			<font size="6">
				<font color="blue">
					Les dernières Proformas
				</font>
			</font>
		</button>
	</b>
</font>
<!-- <p><img src="avert.gif" width="540" height="20"></p> -->
		
<!-- Avec un bouton de formulaire -->
<div align="right">
	<form>
		<input type="image" src="/images/off.jpg" width="30" height="30" onclick="twFermer()">
	</form>
</div>

		<table id="example" class="tablesorter"  cellpadding="0" cellspacing="1" class="sort">
			<thead>
				<tr>
					<th class="tableHeader" id="tdHeader1" ><div align="center"><b><font size=2 >Rep</font></b></div></th>
					<th class="tableHeader" id="tdHeader2" ><div align="center"><b><font size=2 >Sté</font></b></div></th>
					<th class="tableHeader" id="tdHeader3" ><div align="center"><b><font size=2 >N Clt</font></b></div></th>
					<th class="tableHeader" id="tdHeader4" ><div align="center"><b><font size=2 >Raison sociale</font></b></div></th>
					<th class="tableHeader" id="tdHeader5" ><div align="center"><b><font size=2 >Date</font></b></div></th>
					<th class="tableHeader" id="tdHeader6" ><div align="center"><b><font size=2 >Type</font></b></div></th>
					<th class="tableHeader" id="tdHeader7" ><div align="center"><b><font size=2 >N° de pièce</font></b></div></th>
					<th class="tableHeader" id="tdHeader8" ><div align="center"><b><font size=2 >H.T</font></b></div></th>
					<th class="tableHeader" id="tdHeader9" ><div align="center"><b><font size=2 >Référence</font></b></div></th>
					<th class="tableHeader" id="tdHeader10" ><div align="center"><b><font size=2 >Archivé</font></b></div></th>
					<th class="tableHeader" id="tdHeader11" ><div align="center"><b><font size=2 >Clôturé</font></b></div></th>
					<th class="tableHeader" id="tdHeader12" ><div align="center"><b><font size=2 >Nbre Jours d'inaction</font></b></div></th>	
					<th class="tableHeader" id="tdHeader13" ><div align="center"><b><font size=2 >Prochaine action</font></b></div></th>
					<th class="tableHeader" id="tdHeader14" ><div align="center"><b><font size=2 >Date dernier commentaire </font></b></div></th>					
					<th class="tableHeader" id="tdHeader15" ><div align="center"><b><font size=2 >Commentaire</font></b></div></th>
				</tr>
			</thead>
<?php 
	$sql = "SELECT CESOCI, PRREPR, CE\$TYC, CENTIE, PRDCDE, CENCDE, CECREF, PRRAIS, CETHTI, CETTTI, PRLIE1, PRLIE2, PRLIE3, PRCLEE FROM FILCOMSOD.ENTPRFP3
	WHERE PRREPR = '$ID' and PRCLEE = '$cl' ORDER by PRDCDE desc" ;
	$result = odbc_Exec($conn, $sql);

	while (odbc_fetch_row($result)) 
	{
		$PRREPR = odbc_result($result, "PRREPR"); 
		$CESOCI = odbc_result($result, "CESOCI"); 
		$CENTIE = odbc_result($result, "CENTIE"); 
		$PRLIE2 = odbc_result($result, "PRLIE2"); 
		$PRRAIS = odbc_result($result, "PRRAIS"); 
		// $PRDCDE = odbc_result($result, "PRDCDE"); 
		$CETYC = odbc_result($result, "CE\$TYC"); 
		$PRLIE1 = odbc_result($result, "PRLIE1"); 
		$CENCDE = odbc_result($result, "CENCDE"); 
		$CETHTI = odbc_result($result, "CETHTI"); 
		$CETTTI = odbc_result($result, "CETTTI"); 
		$CECREF = odbc_result($result, "CECREF"); 
		$PRDCDE = date_create(odbc_result($result, "PRDCDE"));

		$recupererDetailProforma = "SELECT SUDATD, SUDATP, SUCOMM, SUDATC, SUDATA, SUCOMC, SUCOMA FROM FILWEBSOD.SUIPRFP1 WHERE SUSOCI = '$CESOCI' AND SUNCDE = '$CENCDE'";
		$resultatDetailProforma = odbc_Exec($conn, $recupererDetailProforma);

		$archiver = odbc_result($resultatDetailProforma, "SUDATA");
		$cloturer = odbc_result($resultatDetailProforma, "SUDATC");
		$prochaineAction = odbc_result($resultatDetailProforma, "SUDATP");
		$derniereModification = odbc_result($resultatDetailProforma, "SUDATD");
		$commentaire = odbc_result($resultatDetailProforma, "SUCOMM");
		echo $commentaire;
?>
			<tr>
				<td class="celluleTableauProformas"><div align="center"><font size=2 ><?php echo $PRREPR ; ?></font></div></td>
				<td class="celluleTableauProformas codeSociete"><div align="center"><font size=2 ><?php echo $CESOCI ; ?></font></div></td>
				<td class="celluleTableauProformas numeroClient"><div align="center"><font size=2 ><A Href="<?php echo $PRLIE2 ; ?>" target="_blank" style="color:blue"><?php echo $CENTIE ; ?></font></div></td>
				<td class="celluleTableauProformas raisonSociale"><div align="center"><font size=2 ><?php echo $PRRAIS ; ?></font></div></td>
				<td class="celluleTableauProformas"><div align="center"><font size=2 >20<?php echo date_format($PRDCDE,"y/m/d"); ?></font></div></td>
				<td class="celluleTableauProformas"><div align="center"><font size=1 ><?php echo $CETYC ; ?></font></div></td>
				<td class="celluleTableauProformas numeroProforma"><div align="center"><font size=2 ><A Href="<?php echo $PRLIE1 ; ?>" target="_blank" style="color:blue"><img src="images/iconepdf.png" width="20" height="20"><?php echo $CENCDE ; ?></font></div></td>
				<td class="celluleTableauProformas"><div align="center"><font size=2 ><?php echo number_format($CETHTI, 2,',', '.') ; ?></font></div></td>
				<td class="celluleTableauProformas"><div align="center"><font size=2 ><?php echo $CECREF ; ?></font></div></td>
				<td class="celluleTableauProformas archiverProforma"><div align="center"><font size=2 ><?php echo $archiver;  ?></font></div></td>
				<td class="celluleTableauProformas cloturerProforma"><div align="center"><font size=2 ><?php echo $cloturer;  ?></font></div></td>
				<td class="celluleTableauProformas joursInaction">
					<div align="center">
						<font size=2 >
							<?php 
								if($derniereModification == "")
								{
									$joursInactivite = date("Y-m-d");
								} 
							?>
						</font>
					</div>
				</td>
				<td class="celluleTableauProformas prochaineAction"><div align="center"><font size=2 ><?php echo $prochaineAction; ?></font></div></td>
				<td class="celluleTableauProformas dateCommentaire"><div align="center"><font size=2 ><?php echo $derniereModification;  ?></font></div></td>
				<td class="celluleTableauProformas commentaire"><div align="center"><font size=2 ><?php echo $commentaire; ?></font></div></td>
			</tr>
<?php
	}
?>				
		<p></p>
		</div>
		<div align="left">
			<p>&nbsp;</p>
		</div>

		<div id="formulaireSuiviProformas" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h2 id="titreFormulaireSuiviProformas"></h2>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<img src="images/fermer.png" alt="fermer" class="fermerModale">
						</button>
					</div>
					<div class="modal-body">
						<form id="detailProforma" method="post">
							<div class="container">
								<div class="form-group">
									<label id="modificationCommentaire">Modifié le :</label>
									<textarea id="commentaireProforma" name="commentaireProforma" class="form-control" rows="5" placeholder="Commentaire"></textarea>
								</div>
								<div class="form-group">
									<div class="form-row">
										<div class="col-md-3">
											Prochaine action dans :
										</div>
										<div class="col-md-2">
											<input class="form-control" id="nombreDeJours" type="number">
										</div>
										<div class="col-md-3">
											jours --->
										</div>
										<div class="col-md-4">
											<input type="date" class="form-control" id="dateProchaineAction" name="dateProchaineAction">
										</div>
									</div>
								</div>
								<div class="form-group">
									<div class="form-row">
										<div class="col-md-2">
											<label for="cloture">
												Clôturer
												<input id="cloturerProforma" name="cloturerProforma" type="checkbox" checked>
											</label>	
										</div>
										<div class="col-md-10">
											<input type="text" id="pourquoiCloturerProforma" name="pourquoiCloturerProforma" class="form-control"
											placeholder="Pourquoi ? zone obligatoire si clôturé">
										</div>
									</div>
								</div>
								<div class="form-group">
									<div class="form-row">
										<div class="col-md-2">
											<label for="archiverProforma">
												Archiver
												<input id="archiverProforma" name="archiverProforma" type="checkbox">
											</label>	
										</div>
										<div class="col-md-10">
											<input type="text" class="form-control" id="commentaireArchiverProforma" name="commentaireArchiverProforma" 
											placeholder="Commentaire">
										</div>
									</div>
								</div>
								<div class="form-group">
									<input type="hidden" name="codeSociete" id="codeSociete">
									<input type="hidden" name="numeroClient" id="numeroClient">
									<input type="hidden" name="numeroPiece" id="numeroPiece">
									<input type="hidden" name="ajouterOuModifier" id="ajouterOuModifier">
								</div>
								<div>
									<button class="btn btn-success" name="enregistrerProforma" id="enregistrerProforma">Enregistrer</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>

<?php
	if(isset($_POST['enregistrerProforma']))
	{
		$codeSociete = $_POST['codeSociete'];
		$numeroPiece = intval($_POST['numeroPiece']);
		$numeroClient = intval($_POST['numeroClient']);
		$codeSociete . $numeroClient . $numeroPiece;
		$commentaire = $_POST['commentaireProforma'];
		$dateDerniereModification = date("Y-m-d");
		$dateProchaineAction = $_POST['dateProchaineAction'];
		echo $dateProchaineAction;
		$pourquoiCloturerProforma = $_POST['pourquoiCloturerProforma'];
		$commentaireArchiverProforma = $_POST['commentaireArchiverProforma'];
		
		if(isset($_POST['cloturerProforma']))
		{
			$cloturerProforma = date("Y-m-d");
		}
		else
		{
			$cloturerProforma = "";
		}
		if(isset($_POST['archiverProforma']))
		{
			$archiverProforma = date("Y-m-d");
		}
		else
		{
			$archiverProforma = "";
		}
		$ajouter = $_POST['ajouterOuModifier'];

		if($ajouter == true)
		{
			$requeteDetailProforma = "INSERT INTO FILWEBSOD.SUIPRFP1 VALUES ('$codeSociete', '$numeroPiece', '$numeroClient', '', '$dateDerniereModification', '$dateProchaineAction', 
			'$commentaire', '$cloturerProforma', '$archiverProforma', '$pourquoiCloturerProforma', '$commentaireArchiverProforma')";
		}

		else if($ajouter == false)
		{
			$requeteDetailProforma = "UPDATE FILWEBSOD.SUIPRFP1 SET SUDATD = '$dateDerniereModification', SUDATP = '$dateProchaineAction', SUCOMM = '$commentaire', SUDATC = '$cloturerProforma', 
			SUDATA = '$archiverProforma', SUCOMC = '$pourquoiCloturerProforma', SUCOMA = '$commentaireArchiverProforma' WHERE SUSOCI = '$codeSociete' AND SUNCDE = '$numeroPiece' AND SUNTIE = '$numeroClient'";
		}
		echo $requeteDetailProforma;
		odbc_Exec($conn, $requeteDetailProforma);
	}
?>
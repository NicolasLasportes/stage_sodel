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
		<div align="center">
			<p align="center">
				<img class="monacor" src="images/monacor_international_logo%5B1%5D.gif">
				<img class="dune" src="/logo-dune.png">
			</p>
		</div>
			
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
				
		<div align="right">
			<input type="image" id="boutonFermeture" src="/images/off.jpg" width="30" height="30">
		</div>

		<button id="afficherProformasArchives" class="btn btn-primary">Afficher les proformas archivés</button>
		<table id="example" class="tablesorter" cellpadding="0" cellspacing="1">
			<thead id="enteteTableauProformas"></thead>
			<tbody id="corpsTableauProformas"></tbody>
		</table>

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
											<input id="cloturerProforma" name="cloturerProforma" type="checkbox">
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
								<input type="hidden" id="codeUtilisateur">
								<input type="hidden" name="ajouterOuModifier" id="ajouterOuModifier">
							</div>
							<div>
								<button class="btn btn-success" name="enregistrerProforma" id="enregistrerProforma">Enregistrer</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- On lie tous les fichiers javascript a cette page -->
		<script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
		<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="Js/DataTable.js"></script> <!-- //cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js modifier pour le site -->
		<script type="text/javascript" src="Js/resultatPro.js"></script>
	</body>
</html>


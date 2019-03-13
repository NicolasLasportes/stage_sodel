<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="node_modules/datatable/datatable.min.css">
        <link rel="stylesheet" type="text/css" href="node_modules/fontawesome/css/all.css">
    </head>
    <body>
        <h1 id="titreDeLaPage"></h1>
        <div class="container">
            <div class="row">
                <div class="col-md-2">
                    <button class="btn btn-success" data-toggle="modal" data-target="#formulaireDidactitielOuSchema">Ajouter</button>
                </div>
                <div class="offset-md-8 col-md-2">
                    <button id="fermerPage" class="close">
                        <img src="images/fermer.png" alt="fermer" class="fermerModale">
                    </button>
                </div>
            </div>
        </div>

        <div id="formulaireDidactitielOuSchema" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<div id="titreDeLaModale"></div>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<img src="images/fermer.png" alt="fermer" class="fermerModale">
						</button>
					</div>
					<div class="modal-body">
						<div class="container">
                            <form id="formulaireDidactitielOuSchema" method="post" action="api/ajouter/didactitiel" enctype=multipart/form-data>
                                {{ csrf_field() }}
                                <div class="form-group">
                                    <label for="intitule">Intitulé</label>
                                    <input id="intitule" name="intitule" class="form-control" rows="5" placeholder="Intitulé">
                                </div>
                                <div class="form-group">
                                    <label for="pdf">Pdf</label>
                                    <input type="file" id="pdf" name="pdf" class="form-control-file">
                                </div>
                                <div class="form-group">
                                    <label for="excelOuSchema"></label>
                                    <input type="file" id="excelOuSchema" name="excelOuSchema" class="form-control-file">
                                </div>
                                <div class="form-group">
                                    <label for="excelOuSchema2"></label>
                                    <input type="file" id="excelOuSchema2" name="excelOuSchema2" class="form-control-file">
                                </div>
                                <div class="form-group">
                                    <label for="commentaire">Commentaire</label>
                                    <textarea id="commentaire" name="commentaire" class="form-control" rows="5" placeholder="Commentaire"></textarea>
                                </div>
                                <input type="hidden" name="type" id="type">
                                <div id="boutonEnregistrer">
                                    <button class="btn btn-success" id="enregistrer">Enregistrer</button>
                                </div>
                            </form>
						</div>
					</div>
				</div>
			</div>
        </div>
        
        <script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="node_modules/datatable/datatable.min.js"></script>
        <script type="text/javascript" src="js/function.js"></script>
    </body>
</html>
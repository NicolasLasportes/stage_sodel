<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Commandes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="../css/style.css">
        <link rel="stylesheet" type="text/css" href="../css/dataTables.min.css">
        <link href="../fontawesome/css/all.css" rel="stylesheet">    
    </head>
    <body>
        <h3 id="titre_commande"></h3>
        <div id="envoyer_email"></div>
        <div class="boutonsDetailCommande">
            <button id="afficherFormAjoutProduit" class="btn ajouterProduit" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter un produit</button>
            <a href="{{ url()->previous() }}" id="retourCommandes"class="btn retourCommandes">Retour aux commandes</a>
            <a href="{{ url()->previous() }}" id="cloturerCommande" class="btn cloturerCommande">Clôturer cette commande</a>
        </div>

        <table id="tableauDetailCommande" class="table">
            <thead>
                <tr id="headerDetailCommande">
                    <th class="enteteTableauDetailCommande">Code</th>
                    <th class="enteteTableauDetailCommande">Référence</th>
                    <th class="enteteTableauDetailCommande">Désignation</th>
                    <th class="enteteTableauDetailCommande">Quantité</th>
                    <th class="enteteTableauDetailCommande">Prix</th>
                    <th class="enteteTableauDetailCommande">Stock</th>
                    <!-- <th class="enteteTableauDetailCommande">Gratuit</th> -->
                    <th id="total_detail_commande" class="totalEntete enteteTableauDetailCommande">Total</th>
                </tr>
            </thead>
            <tbody id="corpsDetailCommande"></tbody>
        </table>
        <div class="afficherTotal"></div>

        <!-- Formulaire d'ajout d'une ligne de commande 
        Le formulaire est affiché dans une modale créee avec bootstrap -->

        <div class="modal fade bd-example-modal-lg" id="formulaireAjouterLigneCommande" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ajouter un produit</h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="referenceProduit">Référence du produit</label>
                                <input list="suggestion_produit" type="text" class="form-control" id="referenceProduit" placeholder="Chercher un produit par référence ou désignation">
                                <datalist id="suggestion_produit"></datalist>
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="quantiteProduit">Quantité</label>
                                <input type="number" value="1" class="form-control" id="quantiteProduit" required>
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="prixProduit">Prix unitaire</label>
                                <input type="number" step="0.01" class="form-control" id="prixProduit" placeholder="Facultatif">
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="pourcentageRemise">Remise</label>
                                <input type="text" step="0.01" class="form-control" min="O.OO" max="100.00" id="pourcentageRemise">
                            </div>
                            <!-- <div class="offset-md-2 col-md-8">
                                <input id="gratuitProduit" type="checkbox">
                                <label for="gratuitProduit">Gratuit</label>
                            </div> -->
                        </div>
                        <div id="code_combinaison_produit" type="hidden"></div>
                        <div class="formBtn">
                            <button type="submit" id="validerLigne" class="btnInForm btn btn-success">Valider</button>
                        </div>
                        <div id="dernierLigneSaisie">Derniere ligne saisie :</div>
                        <div class="container">
                            <div class="row" id="infoAjoutLigneCommande">
                                <div id="referenceProduitAjout"></div>
                                <div id="quantiteProduitAjout"></div>
                                <div id="prixUnitaireProduit"></div>
                                <div id="stockProduitAjout"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulaire de modification d'une ligne pour une commande 
        Le formulaire est affiché dans une modale créee les classes avec bootstrap -->
        
        <div id="formulaireModifierLigneCommande" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Modifier une ligne</h2>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="referenceProduitLigne">Référence du produit</label>
                                <input type="text" class="form-control" id="referenceProduitLigne" readonly>
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="quantiteProduitLigne">Quantité</label>
                                <input type="number" class="form-control" id="quantiteProduitLigne">
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="prixProduitLigne">Prix unitaire</label>
                                <input type="number" step="0.01" class="form-control" id="prixProduitLigne" placeholder="Facultatif">
                            </div>
                            <div class="offset-md-2 col-md-8 form-group">
                                <label for="pourcentageRemiseLigne">Remise</label>
                                <input type="text" step="0.01" class="form-control" min="O.OO" max="100.00" id="pourcentageRemiseLigne">
                            </div>
                            <!-- <div class="offset-md-2 col-md-8">
                                <input id="gratuitProduitLigne" type="checkbox">
                                <label for="gratuitProduitLigne">Gratuit</label>
                            </div> -->
                        </div>
                        <div id="code_combinaison_produit_modifier" type="hidden"></div>
                        <div class="formBtn">
                            <button id="validerModificationLigne" data-toggle="modal" data-target="#formulaireModifierLigneCommande" class="btnInForm btn btn-success">Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="../node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="../js/dataTables.min.js"></script>
        <script type="text/javascript" src="../js/function.js"></script>
        <script type="text/javascript" src="../js/event.js"></script>
    </body>
</html>
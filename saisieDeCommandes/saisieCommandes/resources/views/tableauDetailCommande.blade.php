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
        <link rel="stylesheet" type="text/css" href="../awesomplete/awesomplete.css"> 
    </head>
    <body>
        <h3 id="titre_commande"></h3>
        <div id="envoyer_email"></div>
        <div class="boutonsDetailCommande">
            <button id="afficherFormAjoutProduit" class="btn ajouterProduit" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter un produit</button>
            <a href="{{ url()->previous() }}" id="retourCommandes" class="btn retourCommandes">Retour aux commandes</a> <!-- Permet de revenir à l'url précédente -->
            <a id="cloturerCommande" class="btn cloturerCommande">Clôturer</a>
        </div>

        <table id="tableauDetailCommande" class="table">  <!-- Structure du tableau du détail commande -->
            <thead>
                <tr id="headerDetailCommande">
                    <th class="enteteTableauDetailCommande">Code</th>
                    <th class="enteteTableauDetailCommande">Référence</th>
                    <th class="enteteTableauDetailCommande">Désignation</th>
                    <th class="enteteTableauDetailCommande">Quantité</th>
                    <th class="enteteTableauDetailCommande">Prix net</th>
                    <th class="enteteTableauDetailCommande">Stock</th>
                    <th id="total_detail_commande" class="totalEntete enteteTableauDetailCommande">Total</th>
                </tr>
            </thead>
            <tbody id="corpsDetailCommande"></tbody>
        </table>
        <div class="afficherTotal"></div>

        <!-- Formulaire d'ajout d'une ligne de commande, le formulaire est affiché dans une modale créee avec les classes de bootstrap -->

        <div class="modal fade bd-example-modal-lg" id="formulaireAjouterLigneCommande" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" 
        aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header"> <!-- Entête de la modale, contient le titre et le bouton de fermeture -->
                        <h3>Ajouter un produit</h3>
                        <h4 class="chargementProduits"></h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body"> <!-- Contenu de la modale -->
                        <div class="container">
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="referenceProduit">Référence du produit</label>
                                    <input type="text" class="form-control" id="referenceProduit" placeholder="Chercher un produit par référence ou désignation">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="quantiteProduit">Quantité</label>
                                    <input type="number" value="1" class="form-control" id="quantiteProduit" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="prixProduit">Prix unitaire net</label>
                                    <input type="number" step="0.01" class="form-control" id="prixProduit" placeholder="Facultatif">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="pourcentageRemise"></label>
                                    <input type="text" step="0.01" class="form-control" maxlength="3" min="O.OO" max="100.00" id="pourcentageRemise">
                                </div>
                            </div>
                            <div id="code_combinaison_produit" type="hidden"></div>
                        </div>
                        <div class="formBtn">
                            <button type="submit" id="validerLigne" class="btnInForm btn btn-success">Valider</button>
                        </div>
                        <div id="dernierLigneSaisie">Derniere ligne saisie :</div>
                        <div id="infoAjoutLigneCommande">
                            <div id="referenceProduitAjout"></div>
                            <div id="quantiteProduitAjout"></div>
                            <div id="prixUnitaireProduit"></div>
                            <div id="stockProduitAjout"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulaire de modification d'une ligne pour une commande, le formulaire est affiché dans une modale créee les classes avec bootstrap -->
        <div id="formulaireModifierLigneCommande" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" 
        aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header"> <!-- Entête du formulaire, contient le titre et le bouton de fermeture -->
                        <h2>Modifier une ligne</h2>
                        <h4 class="chargementProduits"></h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body"> <!-- Début du formulaire de modification -->
                        <div class="container">
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="referenceProduitLigne">Référence du produit</label>
                                    <input type="text" class="form-control" id="referenceProduitLigne" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="quantiteProduitLigne">Quantité</label>
                                    <input type="number" class="form-control" id="quantiteProduitLigne">
                                </div>
                            </div> 
                            <div class="row-form">
                                <div id="modifier_prix_unitaire" class="offset-md-2 col-md-8 form-group">
                                    <label for="prixProduitLigne">Prix unitaire net</label>
                                    <input type="number" step="0.01" class="form-control" id="prixProduitLigne" placeholder="Facultatif">
                                </div>
                            </div>  
                            <div class="row-form">
                                <div id="modifier_remise" class="offset-md-2 col-md-8 form-group">
                                    <label for="pourcentageRemiseLigne"></label>
                                    <input type="text" step="0.01" class="form-control" maxlength="3" min="O.OO" max="100.00" id="pourcentageRemiseLigne">
                                </div>
                            </div>
                        </div>
                        <div id="code_combinaison_produit_modifier" type="hidden"></div>
                        <div class="formBtn">
                            <button id="validerModificationLigne" data-toggle="modal" data-target="#formulaireModifierLigneCommande" class="btnInForm btn btn-success">
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="../awesomplete/awesomplete.js"></script>
        <script type="text/javascript" src="../node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="../js/dataTables.min.js"></script>
        <script type="text/javascript" src="../js/function.js"></script>
        <script type="text/javascript" src="../js/event.js"></script>
    </body>
</html>
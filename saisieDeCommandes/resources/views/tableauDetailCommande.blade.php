<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>tableau commandes</title>
        <link rel="stylesheet" type="text/css" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="../css/style.css">
    </head>
    <body>
        <h1>Commande n° {{ $idCommande }}</h1>
        <div class="container-fluid">
            <div id="ligneOptions" class="row">
                <div class="offset-md-1 col-md-2">
                    <button class="btn btn-danger">Retour aux commandes</button>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-success" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter un produit</button>
                </div>
                <div class="offset-md-4 col-md-2">
                    <input type="text" id="rechercherCommande" placeholder="Rechercher">
                </div>
            </div>
        </div>

        <table id="tableauDetailCommande" class="table">
            <tr>
                <th class="enteteTableauDetailCommande">Référence</th>
                <th class="enteteTableauDetailCommande">Nom</th>
                <th class="enteteTableauDetailCommande">Quantité</th>
                <th class="enteteTableauDetailCommande">Prix unitaire</th>
                <th class="enteteTableauDetailCommande">Stock</th>
                <th class="enteteTableauDetailCommande">Gratuit</th>
                <th class="enteteTableauDetailCommande">Total</th>
                <th class="enteteTableauDetailCommande">Options</th>
            </tr>
        </table>
        
        <div id="totalCommande">Total :</div>

        <!-- Formulaire d'ajout d'un produit pour une commande 
        Le formulaire est affiché dans une modale crée avec bootstrap -->

        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Ajouter un produit</h2>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/shutdown.png" alt="fermer" id="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <form method="post" action="">
                            <div class="form-row">
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="referenceProduit">Référence du produit</label>
                                    <input type="text" class="form-control" id="referenceProduit" placeholder="Cherchez un produit par son nom">
                                </div>
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="quantiteProduit">Quantité</label>
                                    <input type="number" class="form-control" id="quantiteProduit">
                                </div>
                                <div class="offset-md-2 col-md-8 form-group">
                                    <label for="prixProduit">Prix unitaire</label>
                                    <input type="number" step="0.01" class="form-control" id="prixProduit" placeholder="Facultatif">
                                </div>
                                <div class="offset-md-2 col-md-8">
                                    <input id="gratuitProduit" type="checkbox">
                                    <label for="gratuitProduit">Gratuit</label>
                                </div>
                            </div>
                            <div class="formBtn">
                                <button type="submit" id="validerProduit" class="btnInForm btn btn-success">Valider</button>
                                <button id="fermerModaleProduit" class="btnInForm btn btn-danger">Retour</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="../node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    </body>
</html>
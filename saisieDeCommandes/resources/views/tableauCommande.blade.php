<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>tableau commandes</title>
        <link rel="stylesheet" type="text/css" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
        <h1>Tableau des commandes du client n</h1>

        <div id="ligneOptions" class="row">
            <div class="offset-md-1 col-md-3">
                <button class="btn btn-success" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter une commande</button>
            </div>
            <div class="offset-md-3 col-md-2">
                <input type="text" id="rechercherCommande" placeholder="Rechercher">
            </div>
        </div>

        <table id="tableauCommande" class="table">
            <tr>
                <th class="enteteTableauCommande">N° commande</th>
                <th class="enteteTableauCommande">Référence commande</th>
                <th class="enteteTableauCommande">Type</th>
                <th class="enteteTableauCommande">Date</th>
                <th class="enteteTableauCommande">Options</th>
            </tr>
        </table>


        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <h2>Ajouter une commande</h2>
                    <div class="row">
                        <div class="offset-md-1 col-md-4 sectionFormulaire" id="parametreLivraisonDefaut">
                            <h3>Le client</h3>
                            <div id="identite">Monsieur, Madame nom et prénom</div>
                            <div id="tel">025943952</div>
                            <div id="email">jfzaj@fzaojd.com</div>
                            <div id="adresse">Adresse : 2 boulevard du blabla</div>   
                           
                        </div>
                        <div class="offset-md-1 col-md-5 sectionFormulaire" id="parametreCommande">
                            <h3>La commande</h3>
                            <label for="reference">Référence</label>       
                            <input type="text" id="reference" placeholder="Référence de la commande">
                            <div class="note">Commande ou devis ?</div>
                            <select name="commandeOuDevis" id="commandeOuDevis">
                                <option value="commande">Commande</option>
                                <option value="devis">Devis</option>
                            </select>
                            <div class="note">Notes</div>
                            <textarea name="notes" id="notes" cols="28" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="offset-md-1 col-md-10 sectionFormulaire">
                            <h3>Livraison ( facultatif )</h3>
                        </div>
                        <div class="offset-md-1 col-md-4">
                            <label for="nomLivraison">Nom du destinataire</label>
                            <input type="text" id="nomLivraison">
                        </div>
                        <div class="offset-md-1 col-md-4">
                            <label for="prenomLivraison">Prénom du destinataire</label>
                            <input type="text" id="prenomLivraison">
                        </div>
                        <div class="offset-md-1 col-md-4">
                            <label for="emailLivraison">Email du destinataire</label>
                            <input type="text" id="emailLivraison">
                        </div>
                        <div class="offset-md-1 col-md-4">
                            <label for="telephoneLivraison">Téléphone du destinataire</label>
                            <input type="text" id="telephoneLivraison">
                        </div>
                        <div class="form-group">
                            <label for="inputAddress">Address</label>
                            <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
                        </div>
                    </div>
                    <div class="formBtn">
                        <button type="submit" id="validerCommande" class="btnInForm btn btn-success">Valider</button>
                        <button id="cloturerCommande" class="btnInForm btn btn-primary">Clôturer</button>
                        <button id="fermerModaleCommande" class="btnInForm btn btn-danger">Retour</button>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    </body>
</html>
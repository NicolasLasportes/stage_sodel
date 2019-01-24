<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>tableau commandes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="../css/style.css">
        <link rel="stylesheet" type="text/css" href="../css/dataTables.min.css">
    </head>
    <body>
        <h1 id="titre_client"></h1>
        <div class="container-fluid">
            <div id="ligneOptions" class="row">
                <div class="offset-md-1 col-md-3">
                    <button id="ajouterCommande" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter une commande</button>
                </div>
            </div>
        </div>     

        <div id="monFormulaire">
           
        </div>
        <table id="tableauCommande" class="table">
            <thead>
                <tr>
                    <th class="enteteTableauCommande">N° commande</th>
                    <th class="enteteTableauCommande">Référence commande</th>
                    <th class="enteteTableauCommande">Type</th>
                    <th class="enteteTableauCommande">Date</th>
                    <th class="enteteTableauCommande">Clôturé</th>
                    <th class="enteteTableauCommande">Options</th>
                </tr>
            </thead>
            <tbody id="corpsTableauCommande"></tbody>
        </table>

        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Ajouter une commande</h2>
                        <button class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" id="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="offset-md-1 col-md-4 sectionFormulaire" id="parametreLivraisonDefaut">
                                <h3>Le client</h3>
                                <div id="identite"></div>
                                <div id="tel"></div>
                                <div id="email"></div>
                                <div id="adresse"></div>   
                            </div>
                            <div class="offset-md-1 col-md-5 sectionFormulaire" id="parametreCommande">
                                <h3>La commande</h3>
                                <label for="reference">Référence</label>       
                                <input type="text" id="reference" class="form-control" placeholder="Référence de la commande">
                                <div class="note">Commande ou devis ?</div>
                                <select class="form-control" name="commandeOuDevis" id="commandeOuDevis">
                                    <option value="CDE">Commande</option>
                                    <option value="DEV">Devis</option>
                                </select>
                                <div class="note">Notes</div>
                                <textarea class="form-control" name="notes" id="notes"></textarea>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="offset-md-1 col-md-10 sectionFormulaire">
                                <h3>Livraison ( facultatif )</h3>
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="nomLivraison">Nom du destinataire</label>
                                <input class="form-control" type="text" id="nomLivraison">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="prenomLivraison">Prénom du destinataire</label>
                                <input class="form-control" type="text" id="prenomLivraison">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="emailLivraison">Email du destinataire</label>
                                <input class="form-control" type="email" id="emailLivraison">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="telephoneLivraison">Téléphone du destinataire</label>
                                <input class="form-control" type="text" id="telephoneLivraison">
                            </div>
                            <div class="offset-md-1 col-md-10 adresseLivraison form-group">
                                <label for="adresseLivraison">Adresse de livraison</label>
                                <input class="form-control" type="text" id="adresseLivraison">
                            </div>
                            <div class="offset-md-1 col-md-10 adresseLivraisonDeux form-group">
                                <label for="adresseLivraisonDeux">Adresse de livraison 2</label>
                                <input class="form-control" type="text" id="adresseLivraisonDeux" placeholder="facultatif">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="codePostalLivraison">Code Postal</label>
                                <input type="text" class="form-control" id="codePostalLivraison">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="villeLivraison">Ville</label>
                                <input type="text" class="form-control" id="villeLivraison">
                            </div>
                        </div>                            
                        <div class="formBtn">
                            <button id="validerCommande" data-toggle="modal" data-target=".bd-example-modal-lg" class="btnInForm btn btn-success">Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal modification de l'entete commande -->

        <div class="modal modifierCommande fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Modifier une commande</h2>
                        <button class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" id="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="offset-md-1 col-md-4 sectionFormulaire" id="parametreLivraisonDefaut">
                                <h3>Le client</h3>
                                <div id="identiteModifier"></div>
                                <div id="telModifier"></div>
                                <div id="emailModifier"></div>
                                <div id="adresseModifier"></div> 
                                <div id="complementModifier"></div>
                                <div class="row">
                                    <div class="col-md-3" id="code_postalModifier"></div>
                                    <div class="offset-md-1 col-md-4" id="villeModifier"></div>
                                </div>  
                            </div>
                            <div class="offset-md-1 col-md-5 sectionFormulaire" id="parametreCommande">
                                <h3>La commande</h3>
                                <label for="referenceModifier">Référence</label>       
                                <input type="text" id="referenceModifier" class="form-control" placeholder="Référence de la commande">
                                <div class="noteModifier">Commande ou devis ?</div>
                                <select class="form-control" name="commandeOuDevisModifier" id="commandeOuDevisModifier">
                                    <option value="CDE">Commande</option>
                                    <option value="DEV">Devis</option>
                                </select>
                                <div class="noteModifier">Notes</div>
                                <textarea class="form-control" name="notes" id="notesModifier"></textarea>
                                <div class="invisible" id="numero_commande"></div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="offset-md-1 col-md-10 sectionFormulaire">
                                <h3>Livraison ( facultatif )</h3>
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="nomLivraisonModifier">Nom du destinataire</label>
                                <input class="form-control" type="text" id="nomLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="prenomLivraisonModifier">Prénom du destinataire</label>
                                <input class="form-control" type="text" id="prenomLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="emailLivraisonModifier">Email du destinataire</label>
                                <input class="form-control" type="email" id="emailLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="telephoneLivraisonModifier">Téléphone du destinataire</label>
                                <input class="form-control" type="text" id="telephoneLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-10 adresseLivraison form-group">
                                <label for="adresseLivraisonModifier">Adresse de livraison</label>
                                <input class="form-control" type="text" id="adresseLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-10 adresseLivraisonDeux form-group">
                                <label for="adresseLivraisonDeuxModifier">Adresse de livraison 2</label>
                                <input class="form-control" type="text" id="adresseLivraisonDeuxModifier" placeholder="facultatif">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="codePostalLivraisonModifier">Code Postal</label>
                                <input type="text" class="form-control" id="codePostalLivraisonModifier">
                            </div>
                            <div class="offset-md-1 col-md-4 form-group">
                                <label for="villeLivraisonModifier">Ville</label>
                                <input type="text" class="form-control" id="villeLivraisonModifier">
                            </div>
                        </div>                      
                        <div class="formBtn row">
                            <div class="offset-md-3 col-md-3">
                                <button id="validerModificationCommande" data-toggle="modal" data-target=".modifierCommande" class="btnInForm btn btn-success">Valider</button>
                            </div>
                            <div class="col-md-3">
                                <button id="cloturerModificationCommande" data-toggle="modal" data-target=".modifierCommande" class="btnInForm btn btn-primary">Clôturer</button>
                            </div>
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
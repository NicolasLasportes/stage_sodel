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
        <div id="entetePageCommande" class="container">
            <div class="row">
                <div class="col-md-10">
                    <h2 id="titre_client"></h2>
                </div>
                <div id="retour" class="offset-md-1 col-md-1">
                    <button class="close" id="fermerPage">
                        <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                    </button>
                </div>
            </div>
        </div>
        <div id="ligneOptions">
            <button id="ajouterCommande" class="btn" data-toggle="modal" data-target=".bd-example-modal-lg">Ajouter une commande</button>
        </div>

        <table id="tableauCommande" class="table">
            <thead>
                <tr>
                    <th id="enteteTableauModifier" class="enteteTableauCommande"><i class='fas fa-pen-square'></i></th>
                    <th id="enteteTableauNom" class="enteteTableauCommande nom_commande">Nom</th>
                    <th class="enteteTableauCommande">N° commande</th>
                    <th class="enteteTableauCommande">Référence</th>
                    <th class="enteteTableauCommande">Total HT</th>
                    <th class="enteteTableauCommande">Type</th>
                    <th class="enteteTableauCommande">Date</th>
                    <th class="enteteTableauCommande">Clôturé</th>
                    <th class="enteteTableauCommande">Cde AS400</th>
                    <th id="enteteTableauSupprimer" class="enteteTableauCommande">Supprimer</th>
                    <th id="nom_representant" class="enteteTableauCommande">Nom du représentant</th>
                </tr>
            </thead>
            <tbody id="corpsTableauCommande"></tbody>
        </table>

        <div class="modal fade bd-example-modal-lg" id="formulaireAjouterCommande" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Ajouter une commande</h2>
                        <button class="close" data-dismiss="modal" aria-label="Close">
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col-md-6 sectionFormulaire" id="parametreLivraisonDefaut">
                                <h3>Le client</h3>
                                <div id="identite"></div>
                                <div id="tel"></div>
                                <div id="email"></div>
                                <div id="adresse"></div>   
                            </div>
                            <div class="col-md-6 sectionFormulaire" id="parametreCommande">
                                <h3>La commande</h3>
                                <label for="reference">Référence</label>       
                                <input type="text" maxlength="25" id="reference" class="form-control" placeholder="Référence de la commande">
                                <div class="note">Commande ou devis</div>
                                <select class="form-control" name="commandeOuDevis" id="commandeOuDevis">
                                    <option value="CDE">Commande</option>
                                    <option value="DEV">Devis</option>
                                </select>
                                <div class="note">Notes</div>
                                <textarea class="form-control" name="notes" id="notes" maxlength="110"></textarea>
                            </div>
                        </div>
                        <div id="parametreClient">
                            <input type="hidden" id="num_representant">
                            <input type="hidden" id="cle_representant">
                        </div>
                        <div id="parametreLivraisonFacultatif">
                            <div class="form-row">
                                <div class="offset-md-1 col-md-10 sectionFormulaire">
                                    <h3>Livraison</h3>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-md-6 form-group">
                                    <label for="nomLivraison">Nom du destinataire</label>
                                    <input class="form-control" maxlength="40" type="text" id="nomLivraison">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="prenomLivraison">Prénom</label>
                                    <input class="form-control" maxlength="40" type="text" id="prenomLivraison">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-md-6 form-group">
                                    <label for="emailLivraison">Email</label>
                                    <input class="form-control" type="email" maxlength="80" id="emailLivraison">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="telephoneLivraison">Téléphone</label>
                                    <input class="form-control" type="text" maxlength="20" id="telephoneLivraison">
                                </div>
                            </div>
                            <div class="form_row">
                                <div class="col-md-12 adresseLivraison form-group">
                                    <label for="adresseLivraison">Adresse de livraison</label>
                                    <input class="form-control" type="text" maxlength="30" id="adresseLivraison">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-md-12 adresseLivraisonDeux form-group">
                                    <label for="adresseLivraisonDeux">Complément d'adresse</label>
                                    <input class="form-control" type="text" maxlength="30" id="adresseLivraisonDeux" placeholder="facultatif">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-md-6 form-group">
                                    <label for="codePostalLivraison">Code Postal</label>
                                    <input type="text" class="form-control" maxlength="5" id="codePostalLivraison">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="villeLivraison">Ville</label>
                                    <input type="text" class="form-control" maxlength="26" id="villeLivraison">
                                </div>
                            </div>    
                        </div>                        
                        <div class="formBtn">
                            <button id="validerCommande" class="btnInForm btn btn-success">Valider</button>
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
                            <img src="../images/fermer.png" alt="fermer" class="fermerModale">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col-md-6 sectionFormulaire" id="parametreLivraisonDefautModifier">
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
                            <div class="col-md-6 sectionFormulaire" id="parametreCommande">
                                <h3>La commande</h3>
                                <label for="referenceModifier">Référence</label>       
                                <input type="text" id="referenceModifier" class="form-control" placeholder="Référence de la commande">
                                <div class="noteModifier">Commande ou devis</div>
                                <select class="form-control" name="commandeOuDevisModifier" id="commandeOuDevisModifier">
                                    <option value="CDE">Commande</option>
                                    <option value="DEV">Devis</option>
                                </select>
                                <div class="noteModifier">Notes</div>
                                <textarea class="form-control" name="notes" id="notesModifier" maxlength="110"></textarea>
                                <div class="invisible" id="numero_commande"></div>
                            </div>
                        </div>
                        <div id="parametreLivraisonFacultatifModifier">
                            <div class="form-row">
                                <div class="offset-md-1 col-md-10 sectionFormulaire">
                                    <h3>Livraison</h3>
                                </div>
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="nomLivraisonModifier">Nom du destinataire</label>
                                    <input class="form-control" type="text" maxlength="40" id="nomLivraisonModifier">
                                </div>
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="prenomLivraisonModifier">Prénom</label>
                                    <input class="form-control" type="text" maxlength="40" id="prenomLivraisonModifier" placeholder="facultatif">
                                </div>
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="emailLivraisonModifier">Email</label>
                                    <input class="form-control" type="email" maxlength="80" id="emailLivraisonModifier" placeholder="facultatif">
                                </div>
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="telephoneLivraisonModifier">Téléphone</label>
                                    <input class="form-control" type="text" maxlength="20" id="telephoneLivraisonModifier">
                                </div>
                                <div class="offset-md-1 col-md-10 adresseLivraison form-group">
                                    <label for="adresseLivraisonModifier">Adresse de livraison</label>
                                    <input class="form-control" type="text" maxlength="30" id="adresseLivraisonModifier">
                                </div>
                                <div class="offset-md-1 col-md-10 adresseLivraisonDeux form-group">
                                    <label for="adresseLivraisonDeuxModifier">Adresse de livraison 2</label>
                                    <input class="form-control" type="text" maxlength="30" id="adresseLivraisonDeuxModifier" placeholder="facultatif">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="codePostalLivraisonModifier">Code Postal</label>
                                    <input type="text" class="form-control" maxlength="5" id="codePostalLivraisonModifier">
                                </div>
                                <div class="offset-md-1 col-md-4 form-group">
                                    <label for="villeLivraisonModifier">Ville</label>
                                    <input type="text" class="form-control" maxlength="26" id="villeLivraisonModifier">
                                </div>
                            </div>
                        </div>                      
                        <div class="formBtn">
                            <button id="validerModificationCommande" class="btnInForm btn">Valider</button>
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
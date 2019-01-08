<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>tableau commandes</title>
        <link rel="stylesheet" type="text/css" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
        <h1>Commande n° n</h1>

        <div id="ligneOptions" class="row">
            <div class="offset-md-1 col-md-3">
                <button class="btn btn-success">Ajouter un produit</button>
            </div>
            <div class="offset-md-3 col-md-2">
                <input type="text" id="rechercherCommande" placeholder="Rechercher">
            </div>
        </div>

        <table id="tableauDetailCommande" class="table">
            <tr>
                <th class="enteteTableauDetailCommande">N° commande</th>
                <th class="enteteTableauDetailCommande">Référence commande</th>
                <th class="enteteTableauDetailCommande">Type</th>
                <th class="enteteTableauDetailCommande">Date</th>
                <th class="enteteTableauDetailCommande">Options</th>
            </tr>
        </table>
        
        <script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    </body>
</html>
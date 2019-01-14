var produits = [];
var stocks = [];
function obtenirCommandeClient(id)
{
    console.log("je mexecute")
    $.ajax({
        url : '/commandeClient/' + id,
        type : 'POST',
        contentType : "json",
        statusCode : 
        {
            404:function()
            {
                alert("Client introuvable");
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(commandes)
    {
        console.log(commandes);
        genererTableauCommande(commandes);
        $('#tableauCommande').DataTable();
    });
}

function genererTableauCommande(commandes)
{
    var cloturer; 
    var type;
    for(var i = 0; i < commandes.length; i++)
    {
        if(commandes[i].cloturer_commande == 0)
        {
            cloturer = "";
        }
        else
        {
            cloturer = "C";
        }

        if(commandes[i].type_commande == 0)
        {
            type = "Devis";
        }
        else
        {
            type = "Commande";
        }

        $("#corpsTableauCommande").append(
            "<tr>" + 
                "<td><form method='post'><input name='id_commande' class='invisible id_commande' value='" + commandes[i].id_commande + "'><button name='envoyer_id_commande' class='ligneTableauCommandes' id='afficherCetteCommande' type='submit'>" + commandes[i].numero_commande + "</button></form></td>" + 
                "<td><div class='ligneTableauCommandes'>" + commandes[i].nom_commande + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + type + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + commandes[i].date_commande + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + cloturer + "</div></td>" + 
                "<td class='ligneTableauCommandes'><button class='modifier' id='modifier" + commandes[i].id_commande + "'><img src='images/crayon.png' alt='modifier'></button>" + 
                "<button class='supprimer' id='supprimer" + commandes[i].id_commande + "'><img src='images/corbeille.png' alt='supprimer'></button></td>"  + 
            "</tr>"
        );
    }
}

function obtenirDetailCommande(id)
{
    $.ajax({
        url : '/produitsDeCommande/' + id,
        type : 'POST',
        contentType : "json",
        statusCode : 
        {
            404:function()
            {
                alert("Commande introuvable");
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(detailCommande)
    {
        console.log(detailCommande);
        for(var i = 0; i < detailCommande.length; i++)
        {
            recupererProduit(detailCommande[i].id_produit, detailCommande);
        }
    });
}

function recupererProduit(idProduit, contenir)
{
    $.ajax({
        url : '/produit/' + idProduit,
        type : 'POST',
        contentType : "json",
        statusCode : 
        {
            404:function()
            {
                alert("Produit introuvable");
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(produit)
    {
        var tabTemp = [];
        tabTemp.push(produit[0].id_produit);
        tabTemp.push(produit[0].reference_produit);
        tabTemp.push(produit[0].nom_produit);
        tabTemp.push(produit[0].prix_unitaire_produit);
        produits.push(tabTemp);
        console.log(produits);
        console.log(contenir); 
        if(produits.length == contenir.length)
        {
            for(var i = 0; i < produits.length; i++)
            {
                recupererStock(produits[i][0], produits, contenir);        
            }
        }        
    });
}

function recupererStock(id_produit, produit, contenir)
{
    $.ajax({
        url : '/stock/' + id_produit,
        type : 'POST',
        contentType : "json",
        statusCode : 
        {
            404:function()
            {
                alert("Produit introuvable");
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(stock)
    {
        console.log("je vais récuperer le stock du produit " + id_produit);
        var temp = [];
        temp.push(stock[0].quantite_stock);
        temp.push(stock[0].fournisseur_stock);
        temp.push(stock[0].commentaire_stock);
        stocks.push(temp);
        console.log(produit);
        console.log(contenir);
        console.log(stocks);
        genererTableauDetailCommande(produit, stocks, contenir);
    });
}

function genererTableauDetailCommande(produit, stock, contenir)
{
    var commentaire_stock;
    for(var i = 0; i < produit.length; i++)
    {
        if(stock[i][2] == null)
        {
            commentaire_stock = "";
        }
        else
        {
            commentaire_stock = stock[i][2];
        }

        $("#tableauDetailCommande").append(
            "<tr>"+
                "<td>" + produit[i][1] + "</td>" +
                "<td>" + produit[i][2] + "</td>" +
                "<td>" + contenir[i].quantite_produit + "</td>" +
                "<td>" + produit[i][3] + "</td>" +
                "<td>" + stock[i][0] + "(" + stock[i][1] + ")" + commentaire_stock + "</td>" +
                "<td>" + produit[i][1] + "</td>" +
                "<td>" + produit[i][1] + "</td>" +
                "<td>" + produit[i][1] + "</td>" +

        )
    }





    $('#tableauDetailCommande').DataTable();
}

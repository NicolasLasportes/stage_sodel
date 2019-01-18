var produits = [];
var stocks = [];
var id_inverse = [];
var id_client = "";
var secondes = 0;
var code_societe;

// var timer = setInterval(function()
// { 
//     secondes++;
//     console.log(secondes);
//     if(secondes == 100)
//     {
//         clearInterval(timer);
//     } 
// }, 1000);

//on récupère l'url et on met chaque caractère dans un tableau 
var current_url = window.location.href.split('');

for(var i = current_url.length - 1; i >= 0; i--)
{
    if(current_url[i] == "/")
    {
        
        for(var j = id_inverse.length - 1; j >= 0; j--)
        {
            id_client += id_inverse[j];
        }
        break;
    }
    
    else
    {
        id_inverse.push(current_url[i]);
    }
}


function obtenirCommandeClient(id)
{
    $.ajax({
        url : '../commandesClient/' + id,
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
        $("#titre_client").append("Commandes de " + commandes[0].nom_client);
        genererTableauCommande(commandes);
        $('#tableauCommande').DataTable();
    });
}

function genererTableauCommande(commandes)
{
    var cloturer; 
    var type;
    var administration;
    for(var i = 0; i < commandes.length; i++)
    {
        if(commandes[i].cloture_commande == "")
        {
            cloturer = "Non";
            administration = "<td class='ligneTableauCommandes'><button class='modifier' id='modifier" + commandes[i].id_commande + "'><img src='../images/crayon32.png' alt='modifier'></button>" + 
            "<button class='supprimer' id='supprimer" + commandes[i].id_commande + "'><img src='../images/corbeille32.png' alt='supprimer'></button></td>";
        }
        else
        {
            cloturer = "Oui";
            administration = "";
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
                "<td><button name='envoyer_id_commande' id='" + commandes[i].numero_commande + "' class='ligneTableauCommandes afficherCetteCommande'>" + commandes[i].numero_commande + "</button></td>" + 
                "<td><div class='ligneTableauCommandes'>" + commandes[i].reference_commande + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + type + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + afficherDate(commandes[i].date_commande) + "</div></td>" + 
                "<td><div class='ligneTableauCommandes'>" + cloturer + "</div></td>" + 
                administration + 
            "</tr>"
        );
    }
}

function afficherDate(date)
{
    jour = date.substring(8, 10);
    annee = date.substring(0, 4);
    mois = date.substring(5, 7);
    return jour + " " + mois + " " + annee;
}

function cloturerCommande(numero_commande)
{
    console.log(numero_commande);
    $.ajax({
        url : '../cloturerCommande',
        type : 'POST',
        dataType : "json",
        data: {
            numero_commande: numero_commande
        },
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
    }).done(function(reponse)
    {
        console.log(reponse);
    }).fail(function(reponse)
    {
        console.log(reponse);
    });
}

/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Fonction pour la page de détail d'une commande 
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/



function obtenirDetailCommande(id_commande, id_client)
{
    $.ajax({
        url : '../detailCommandeClient/' + id_commande + "&" + id_client,
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
        genererTableauDetailCommande(detailCommande);

    });
}

function genererTableauDetailCommande(detailCommande)
{
    $("#corpsDetailCommande").empty();
    var total = 0;
    for(var i = 0; i < detailCommande.length; i++)
    {
        var stock; 
        var gratuit;
        var totalLigne = detailCommande[i].prix_unitaire * detailCommande[i].quantite;

        if(detailCommande[i].commentaire_stock === undefined)
        {
            stock = detailCommande[i].stock01 + " (Fournisseur : " + detailCommande[i].stock02 + ")";
        }
        else 
        {
            stock = detailCommande[i].stock01 + " (Fournisseur : " + detailCommande[i].stock02 + ") " + detailCommande[i].commentaire_stock;
        }

        if(detailCommande[i].prix_unitaire == 0)
        {
            gratuit = "Oui";
        }
        else
        {
            gratuit = "Non";
        }
        
        $("#corpsDetailCommande").append(
            "<tr>"+
                "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].code_societe + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].reference_produit + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].designation_produit + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + parseInt(detailCommande[i].quantite) + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].prix_unitaire + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + stock + "</td>" +
                "<td class='" + detailCommande[i].reference_produit + "'>" + gratuit + "</td>" +
                "<td class='total " + detailCommande[i].reference_produit + "' data-total='" + totalLigne + "'>" + totalLigne.toFixed(2) + "</td>" +
                "<td class='ligneTableauCommandes'><button data-toggle='modal' data-target='#modifierLigneCommande' class='modifier' id='" + detailCommande[i].reference_produit + "modifier'><img src='../images/crayon32.png' alt='modifier'></button>" + 
                "<button class='supprimer' id='" + detailCommande[i].reference_produit + "supprimer'><img src='../images/corbeille32.png' alt='supprimer'></button></td>"  + 
            "</tr>"
        );
    }

    var colonne_total = $(".total");
    for (var i = 0; i < colonne_total.length; i++)
    {
        total = total + $(colonne_total[i]).data('total');
    }

    $("#total_detail_commande").empty();
    $("#total_detail_commande").append("Total : " + total + " €");
    $('#tableauDetailCommande').DataTable();
}

function obtenirProduits(dossier)
{
    $.ajax({
        url : '../listeProduits/' + dossier,
        type : 'POST',
        contentType : "json",
        statusCode : 
        {
            404:function()
            {
                alert("Produits introuvable");
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(produits)
    {
        for(var i = 0; i < produits.length; i++)
        {
            $("#suggestion_produit").append("<option value='" + produits[i].numero_produit + "'></option>"); //+ " stock01 : " + produits[i].stock01 + " stock02 : " + produits[i].stock02 + " commentaire : " + produits[i].commentaire + "'></option>");
        }
    });
}

function ajouterLigne()
{
    var reference_produit = $("#referenceProduit").val();
    var quantite = $("#quantiteProduit").val();
    var prix_unitaire = $("#prixProduit").val();
    var gratuit = "non";
    var numero_commande = recupererNumCommande(id_inverse); //la variable numero_commande contient le n° de commande actuel récupérer dans l'url
    var dossier = recupererDossierClient(id_inverse);
    $("#referenceProduit").val("");
    $("#quantiteProduit").val("");
    $("#prixProduit").val("");
    $('#gratuitProduit').prop("checked", false);

    if ($('#gratuitProduit').is(":checked"))
    {
        gratuit = "oui";
    }

    if(prix_unitaire == "")
    {
        prix_unitaire = 0;
    }

    $.ajax({
        url: "../ajouterLigneCommande",
        type: "post",
        dataType: 'json',
        data: { 
            numero_commande: numero_commande,
            reference_produit: reference_produit,
            quantite: quantite, 
            prix_unitaire: prix_unitaire,
            dossier: dossier,
            gratuit: gratuit
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function()
    {
        $('#tableauDetailCommande').DataTable().destroy();
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse));
    });
}

function recupererNumCommande(url)
{
    var numero_commande = [];
    for(var i = url.length -1; i >= 0; i--)
    {
        if(url[i] == "&")
        {
            break;
        }
        
        else
        {
            numero_commande.push(url[i]);
        }
    }
    return numero_commande.join('');;
}

function recupererDossierClient(url)
{
    var dossier = [];
    for(var i = 0; i < url.length; i++)
    {
        if(url[i] == "&")
        {
            break;
        }

        else
        {
            dossier.push(url[i]);
        }
    }
    return dossier.reverse().join('');
}

function supprimerLigneCommande(code_produit)
{
    var numero_commande = recupererNumCommande(id_inverse);
    $.ajax({
        url: "../supprimerLigneCommande",
        type: "post",
        dataType: 'json',
        data: { 
            numero_commande: numero_commande,
            code_produit: code_produit,
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function()
    {   
        $('#tableauDetailCommande').DataTable().destroy();
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse))
    });
}

function formulaireModification(ligneCommande)
{
    var code_societe = ligneCommande[0];
    $("#referenceProduitLigne").val(ligneCommande[1]);
    $("#quantiteProduitLigne").val(ligneCommande[3]);
    $("#prixProduitLigne").val(ligneCommande[4]);

    if(ligneCommande[6] == "Oui")
    {
        $("#gratuitProduitLigne").prop('checked', true);
    }
    else
    {
        $("#gratuitProduitLigne").prop('checked', false);
    }
}

function modifierLigneCommande(code_societe)
{
    var code_produit = $("#referenceProduitLigne").val();
    var quantite =  $("#quantiteProduitLigne").val();
    var prix_unitaire = $("#prixProduitLigne").val();
    var gratuit = $("#gratuitProduitLigne").prop("checked");

    if(gratuit == true)
    {
        prix_unitaire = 0;
    }

    $.ajax({
        url: "../modifierLigneCommande",
        type: "post",
        dataType: 'json',
        data: { 
            numero_commande: recupererNumCommande(id_inverse),
            code_societe: code_societe,
            code_produit: code_produit,
            quantite: quantite,
            prix_unitaire: prix_unitaire
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function()
    {
        $('#tableauDetailCommande').DataTable().destroy();
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse))
    })
}
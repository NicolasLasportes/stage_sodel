var id_inverse = [];
var id_client = "";
var genererColonneOptions = true;
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
    return numero_commande.join('');
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


/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Fonctions pour la page des commandes d'un client 
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/


function obtenirCommandeClient(dossier_client)
{
    $.ajax({
        url : '../commandesClient/' + dossier_client,
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
    }).done(function(listeDesCommandes)
    {
        $("#titre_client").append("Commandes de " + listeDesCommandes[listeDesCommandes.length -1].nom_client);
        genererTableauCommande(listeDesCommandes);
        $('#tableauCommande').DataTable();
    });
}

function genererTableauCommande(commandes)
{
    var cloturer; 
    var type;
    var administration;
    $("#corpsTableauCommande").empty();
    for(var i = 0; i < commandes.length -1; i++)
    {
        console.log(commandes[i].type_commande);
        if(commandes[i].cloture_commande == "")
        {
            cloturer = "Non";
            administration = "<td class='administrationTableauCommandes'><button class='modifier' id='modifier" + commandes[i].numero_commande + 
            "'><img src='../images/crayon32.png' alt='modifier'></button>" + 
            "<button class='supprimerCommande' id='supprimer" + commandes[i].numero_commande + "'><img src='../images/corbeille32.png' alt='supprimer'></button></td>";
        }
        else
        {
            cloturer = "Oui";
            administration = "<td></td>";
        }

        if(commandes[i].type_commande == "DEV")
        {
            type = "Devis";
        }
        else
        {
            type = "Commande";
        }

        $("#corpsTableauCommande").append(
            "<tr>" + 
                "<td><div id='" + commandes[i].numero_commande + "' class='ligneTableauCommandes numero_commande'>" + commandes[i].numero_commande + "</div></td>" + 
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
    }).fail(function(err)
    {
        console.log(err);
    });
}

function detailClient(dossier)
{
    console.log(dossier);
    $.ajax({
        url: '../detailClient',
        type: 'post',
        dataType: 'json',
        data: {
            dossier: dossier
        },
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
    }).done(function(reponse)
    {
        $("#identite").append(reponse.nom_client);
        $("#tel").append(reponse.telephone_client);
        $("#email").append(reponse.mail_client);
        $("#adresse").append("<div id='adresse_client'>" + reponse.nom_voie_client + "</div><div id='complement_adresse_client'> " + 
        reponse.complement + "</div><div id='numero_voie_client'> " + reponse.num_voie_client + "</div><div class='row'><div class='col-md-3' id='code_postal_client'>" + 
        reponse.code_postal_client + "</div><div class='col-md-6' id='ville_client'>" + reponse.ville_client + "</div>");

        $("#nomLivraison").val(reponse.nom_client); 
        $("#emailLivraison").val(reponse.mail_client); 
        $("#telephoneLivraison").val(reponse.telephone_client);
        $("#adresseLivraison").val(reponse.nom_voie_client);
        $("#adresseLivraisonDeux").val(reponse.complement);
        $("#villeLivraison").val(reponse.ville_client);
        $("#codePostalLivraison").val(reponse.code_postal_client);
    }).fail(function(err)
    {
        console.log(err);
    });
}

function ajouterCommande()
{
    var reference = $("#reference").val();
    var type = $("#commandeOuDevis").val();
    var commentaire = $("#notes").val();
    var nom_livraison = $("#nomLivraison").val();
    var prenom_livraison = $("#prenomLivraison").val();
    var telephone_livraison = $("#telephoneLivraison").val();
    var mail_livraison = $("#emailLivraison").val();
    var adresse1_livraison = $("#adresseLivraison").val();
    var adresse2_livraison = $("#adresseLivraisonDeux").val();
    var ville_livraison = $("#villeLivraison").val();
    var code_postal_livraison = $("#codePostalLivraison").val();
    var nom_client = $("#identite").html();
    var telephone_client = $("#tel").html();
    var mail_client = $("#email").html();
    var adresse1_client = $("#adresse_client").html();
    var adresse2_client = $("#complement_adresse_client").html();
    var ville_client = $("#ville_client").html();
    var code_postal_client = $("#code_postal_client").html();

    if(reference == "" || type == "" || commentaire == "")
    {
        alert("Veuillez remplir la partie 'La commande'.");
    }
    else if(nom_livraison == "" || telephone_livraison == "" || mail_livraison == "" || adresse1_livraison == "" || ville_livraison == "" || code_postal_livraison == "")
    {
        alert("Veuillez remplir la partie 'Livraison'.");
    }
    else
    {
        $.ajax({
            url: '../ajouterCommande',
            type: 'post',
            dataType: 'json',
            data: {
                nom_client: nom_client,
                mail_client: mail_client,
                telephone_client: telephone_client,
                adresse1_client: adresse1_client,
                adresse2_client: adresse2_client,
                ville_client: ville_client,
                code_postal_client: code_postal_client,
                nom_client_livraison: nom_livraison,
                prenom_client_livraison: prenom_livraison,
                mail_client_livraison: mail_livraison,
                telephone_client_livraison: telephone_livraison,
                adresse1_client_livraison: adresse1_livraison,
                adresse2_client_livraison: adresse2_livraison,
                ville_client_livraison: ville_livraison,
                code_postal_client_livraison: code_postal_livraison,
                reference_commande: reference,
                type_commande: type,
                commentaire_commande: commentaire,
                dossier_client: recupererDossierClient(id_inverse)
            },
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
        }).done(function(reponse)
        {
            console.log(reponse);
            $('#tableauCommande').DataTable().destroy();
            obtenirCommandeClient(reponse.dossier_client);
        }).fail(function(err)
        {
            console.log(err);
        });
    }
}

function supprimerCommande(numero_commande, dossier_client)
{
    console.log(numero_commande);
    console.log(dossier_client);
    $.ajax({
        url: '../supprimerCommande',
        type: 'post',
        dataType: 'json',
        data: 
        {
            numero_commande: numero_commande
        },
        headers: 
        {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(reponse)
    {
        console.log(reponse);
        $('#tableauCommande').DataTable().destroy();
        obtenirCommandeClient(dossier_client);
    }).fail(function(err)
    {
        console.log(err);
    });
}

function modifierCommande(numero_commande)
{
    var type_commande = ;
    var commentaire_commande = ;
    var nom_livraison = ;
    var prenom_livraison = ;
    var telephone_livraison = ;
    var email_livraison = ;
    var adresse1_livraison = ;
    var adresse2_livraison = ;
    var ville_livraison = ;
    var code_postal_livraison = ;
    $.ajax({
        url: '../modifierCommande',
        type: 'post',
        dataType: 'json',
        data: 
        {
            numero_commande: numero_commande,
            reference_commande: reference_commande,
            type_commande: type_commande,
            commentaire_commande: commentaire_commande,
            nom_livraison: nom_livraison,
            prenom_livraison: prenom_livraison,
            telephone_livraison: telephone_livraison,
            email_livraison: email_livraison,
            adresse1_livraison: adresse1_livraison,
            adresse2_livraison: adresse2_livraison,
            ville_livraison: ville_livraison,
            code_postal_livraison: code_postal_livraison
        },
        headers: 
        {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(reponse)
    {
        console.log(reponse);
    }).fail(function(err)
    {
        console.log(err);
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
        console.log(detailCommande);
        verifierCommandeCloturer(recupererNumCommande(id_inverse), detailCommande);
    });
}

function verifierCommandeCloturer(numero_commande, detailCommande)
{
    $.ajax({
        url : '../verifierCommandeCloturer',
        type : 'post',
        dataType: 'json',
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
        genererTableauDetailCommande(detailCommande, reponse.cloturer_commande);
    }).fail(function(err)
    {
        alert("Une erreur est survenue");
        console.log(err);
    });
}

function genererTableauDetailCommande(detailCommande, cloturer_commande)
{
    $("#corpsDetailCommande").empty();
    var total = 0;

    if(cloturer_commande == "IPAD")
    {
        $("#headerDetailCommande").find('th').each(function() 
        {
            $(this).removeClass('enteteTableauDetailCommande').addClass('enteteTableauCommande');
        }); 
    }
    else if(cloturer_commande == "" && genererColonneOptions == true)
    {
        $("#afficherFormAjoutProduit").show();
        $("#cloturerCommande").show();
        $("#headerDetailCommande").append("<th id='administrationDetailCommande' class='enteteTableauDetailCommande'>Options</th>");
        genererColonneOptions = false;
    }

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

        if(cloturer_commande == 'IPAD')
        {
            $("#corpsDetailCommande").append(
                "<tr>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].code_societe + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].reference_produit + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].designation_produit + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + parseInt(detailCommande[i].quantite) + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].prix_unitaire + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + stock + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + gratuit + "</td>" +
                    "<td class='total " + detailCommande[i].reference_produit + "' data-total='" + totalLigne + "'>" + totalLigne.toFixed(2) + "</td>" +
                "</tr>"
            );
        }
        
        else
        {
            $("#corpsDetailCommande").append(
                "<tr>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + detailCommande[i].code_societe + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + detailCommande[i].reference_produit + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + detailCommande[i].designation_produit + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + parseInt(detailCommande[i].quantite) + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + detailCommande[i].prix_unitaire + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + stock + "</td>" +
                    "<td class='ligneDetailCommande " + detailCommande[i].reference_produit + "'>" + gratuit + "</td>" +
                    "<td class='ligneDetailCommande total " + detailCommande[i].reference_produit + "' data-total='" + totalLigne + "'>" + totalLigne.toFixed(2) + "</td>" +
                    "<td class='administrationTableauCommandes'><button class='supprimer' id='" + detailCommande[i].reference_produit + 
                    "supprimer'><img src='../images/corbeille32.png' alt='supprimer'></button></td>"  + 
                "</tr>"
            );
        }
        
    }

    var colonne_total = $(".total");
    for (var i = 0; i < colonne_total.length; i++)
    {
        total = total + $(colonne_total[i]).data('total');
    }

    $("#total_detail_commande").empty();
    $("#total_detail_commande").append("Total : " + total.toFixed(2) + " €");
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
            $("#suggestion_produit").append("<option value='" + produits[i].numero_produit + "'>" + produits[i].numero_produit + " [" + produits[i].designation_produit + "]" + "</option>");
        }
    });
}

function ajouterLigne()
{
    if($("#referenceProduit").val() == "")
    {
        alert("Veuillez saisir un produit valide");
    }
    else if($("#quantiteProduit").val() == "" || $("#quantiteProduit").val() <= 0)
    {
        alert("Veuillez saisir une quantité supérieure ou égale à 0");
    }
    else
    {
        var reference_produit = $("#referenceProduit").val();
        var quantite = $("#quantiteProduit").val();
        var prix_unitaire = $("#prixProduit").val();
        var gratuit = "non";
        var numero_commande = recupererNumCommande(id_inverse); //la variable numero_commande contient le n° de commande actuel récupéré dans l'url
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
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse));
    });
}

function formulaireModification(ligneCommande)
{
    var code_societe = ligneCommande[0];
    console.log(code_societe);
    $("#referenceProduitLigne").val();
    $("#quantiteProduitLigne").val();
    $("#prixProduitLigne").val();
    $("#gratuitProduitLigne").prop('checked', false);

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
    console.log(code_societe);
    var code_produit = $("#referenceProduitLigne").val();
    var quantite =  $("#quantiteProduitLigne").val();
    var prix_unitaire = $("#prixProduitLigne").val();
    var gratuit = $("#gratuitProduitLigne").prop("checked");

    $.ajax({
        url: "../modifierLigneCommande",
        type: "post",
        dataType: 'json',
        data: { 
            numero_commande: recupererNumCommande(id_inverse),
            code_societe: code_societe,
            code_produit: code_produit,
            quantite: quantite,
            prix_unitaire: prix_unitaire,
            gratuit: gratuit,
            dossier: recupererDossierClient(id_inverse)
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(donnee)
    {   
        console.log(donnee);
        $('#tableauDetailCommande').DataTable().destroy();
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse))
    }).fail(function(err)
    {
        console.log(err);
    })
}
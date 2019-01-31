var id_inverse = [];
var id_client = "";
var genererColonneOptions = true;
var url_actuelle = window.location.href.split('');
var afficher_dernier_produit = false;
var reference_dernier_produit = "";
var page_courante = "";
var cle_commercial = [];
var nom_commercial = [];
var code_T = [];
var direction = false;

for(var i = url_actuelle.length - 1; i >= 0; i--)
{
    if(url_actuelle[i] == "/")
    {
        
        for(var j = id_inverse.length - 1; j >= 0; j--)
        {
            id_client += id_inverse[j];
        }
        break;
    }
    
    else
    {
        id_inverse.push(url_actuelle[i]);
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
    dossier = dossier.reverse().join('');

    if(dossier.indexOf('#') > -1)
    {
        dossier = dossier.substring(0, dossier.indexOf('#'));
    }
    return (dossier);
}

function recupererCleCommercial(url)
{
    var tableau_a_remplir = 1;
  
    for( var i = url.length - 1; i >= 0; i--)
    {
        if(url[i] == "&")
        {
            tableau_a_remplir++;
        }

        else if(tableau_a_remplir == 1)
        {
            cle_commercial.push(url[i]);
        }

        else if(tableau_a_remplir == 2)
        {
            nom_commercial.push(url[i]);
        }
    }

    cle_commercial = cle_commercial.join('');
    nom_commercial = nom_commercial.join('');

    if(nom_commercial == "code=T")
    {
        direction = true;
        nom_commercial = "Tous secteurs";
    }
    else
    {
        nom_commercial = nom_commercial.replace("intitule=", "").replace("%20", " ");
    }
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
        console.log(listeDesCommandes)
        $("#titre_client").empty().append("Commandes de " + listeDesCommandes[listeDesCommandes.length -1].nom_client);
        if(listeDesCommandes[listeDesCommandes.length -1].nom_client != undefined)
        {
            listeDesCommandes.splice(-1, 1);

        }
        if(listeDesCommandes.length >=  0)
        {
            console.log(listeDesCommandes)
            genererTableauCommande(listeDesCommandes, 0);
            $('#tableauCommande').DataTable({
                "order": [[ 1, "desc" ]]
            });
        }
        else
        {
            $('#tableauCommande').DataTable({
                "order": [[ 1, "desc" ]]
            });
        }
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function genererTableauCommande(commandes, interface)
{
    var cloturer; 
    var modification;
    var suppression;
    var nom;
    var nom_representant = "";
    $("#corpsTableauCommande").empty();
    for(var i = 0; i < commandes.length; i++)
    {
        if(commandes[i].nom_representant != undefined)
        {   
            nom_representant = "<td class='ligneTableauCommandes'>" + commandes[i].nom_representant + "</td>";
        }
        else
        {
            $("#nom_representant").remove();
        }
 
        if(commandes[i].cloture_commande == "IPAD")
        {
            cloturer = "Oui";
        }
        else if(commandes[i].cloture_commande == "")
        {
            cloturer = "";
        }

        if(interface == 1)
        {

            if(commandes[i].nom_client != commandes[i].nom_client_livraison || commandes[i].adresse_facture != commandes[i].adresse_livraison || commandes[i].ville_facture != commandes[i].ville_livraison || commandes[i].code_postal_livraison != commandes[i].code_postal_facture)
            {
                nom = "<td class='ligneTableauCommandes nom_commande'>" + commandes[i].nom_client + "<br> Livré à : " + commandes[i].nom_client_livraison + " " +
                " " + commandes[i].code_postal_livraison + " " +
                commandes[i].ville_livraison + "</td>";
            }
            else
            {
                nom = "<td class='ligneTableauCommandes'>" + commandes[i].nom_client + "</td>";
            }

            modification = "";
            suppression = "";
            $("#enteteTableauModifier").remove();
            $("#enteteTableauSupprimer").remove();
            $("#ajouterCommande").hide();
        }

        else if(interface == 0 && cloturer == "")
        {
            $("#enteteTableauNom").remove();
            nom = "";
            modification = "<td><button data-toggle='modal' data-target='.modifierCommande'" + "class='modifier btn btn-dark a-btn-slide-text' id='modifier" + 
            commandes[i].numero_commande + "'>" + "<i class='fas fa-pen-square'></i></button></td>";
            
            suppression = "<td><button class='supprimerCommande' id='supprimer" + commandes[i].numero_commande + 
            "'><img src='../images/corbeille24.png' alt='supprimer'></button></td>";
        }

        else if(interface == 0 && cloturer == "Oui")
        {
            $("#enteteTableauNom").remove();
            nom = "";
            modification = "<td></td>";
            suppression = "<td></td>";
        }

        if(commandes[i].ventiler_commande == 0)
        {
            ventiler_commande = "";
        }

        else
        {
            ventiler_commande = commandes[i].ventiler_commande;
        }

        $("#corpsTableauCommande").append(
            "<tr>" + 
                modification +
                nom +
                "<td data-dossier='" + commandes[i].dossier + "'id='" + commandes[i].numero_commande + "' class='ligneTableauCommandes numero_commande'>" + 
                    commandes[i].numero_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + commandes[i].reference_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + commandes[i].type_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + afficherDate(commandes[i].date_commande) + "</td>" + 
                "<td class='ligneTableauCommandes'>" + cloturer + "</td>" + 
                "<td class='ligneTableauCommandes'>" + ventiler_commande + "</td>" +
                suppression + 
                nom_representant +
            "</tr>"
        );
    }
}

function afficherDate(date)
{
    jour = date.substring(8, 10);
    annee = date.substring(0, 4);
    mois = date.substring(5, 7);
    return jour + "/" + mois + "/" + annee;
}

function cloturerCommande(numero_commande)
{
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
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function detailClient(dossier)
{
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
        console.log(reponse);
        $("#identite").empty();
        $("#tel").empty();
        $("#email").empty();
        $("#adresse").empty();
        $("#identite").append(reponse.nom_client);
        $("#tel").append(reponse.telephone_client);
        $("#email").append(reponse.mail_client);
        $("#adresse").append("<div id='adresse_client'>" + reponse.nom_voie_client + "</div><div id='complement_adresse_client'> " + 
        reponse.complement + "</div><div id='numero_voie_client'> " + reponse.num_voie_client + "</div><div class='row'><div class='col-md-3' id='code_postal_client'>" + 
        reponse.code_postal_client + "</div><div class='col-md-6' id='ville_client'>" + reponse.ville_client + "</div>");

        $("#cle_representant").val(reponse.cle_representant);
        $("#num_representant").val(reponse.numero_representant);

        $("#nomLivraison").val(reponse.nom_client); 
        $("#emailLivraison").val(reponse.mail_client); 
        $("#telephoneLivraison").val(reponse.telephone_client);
        $("#adresseLivraison").val(reponse.nom_voie_client);
        $("#adresseLivraisonDeux").val(reponse.complement);
        $("#villeLivraison").val(reponse.ville_client);
        $("#codePostalLivraison").val(reponse.code_postal_client);
    }).fail(function()
    {
        alert("Une erreur est survenue");
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
    var cle_representant = $("#cle_representant").val();
    var numero_representant = $("#num_representant").val();

    if(reference.length > 25)
    {
        alert("La référence comporte trop de caractères (25 maximum).");
    }

    else if(nom_livraison.length > 40)
    {
        alert("Le nom comporte trop de caractères (40 maximum).");
    }

    else if(prenom_livraison.length > 40)
    {
        alert("Le prénom comporte trop de caractères (40 maximum).");
    }

    else if(ville_livraison.length > 26)
    {
        alert("La ville comporte trop de caractères (26 maximum).");
    }

    else if(adresse1_livraison.length > 30)
    {
        alert("L'adresse de livraison comporte trop de caractères (30 maximum).");
    }
    
    else if(code_postal_livraison.length > 5)
    {
        alert("Le code postal comporte trop de caractères (5 maximum).");
    }

    else if(adresse2_livraison.length > 30)
    {
        alert("Le complément d'adresse comporte trop de caractères (30 maximum).");
    }

    else if(reference == "" || type == "")
    {
        alert("Veuillez remplir la référence de la commande");
    }

    else if(nom_livraison == "" || adresse1_livraison == "" || ville_livraison == "" || code_postal_livraison == "")
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
                dossier_client: recupererDossierClient(id_inverse),
                cle_representant: cle_representant,
                num_representant: numero_representant
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
            window.location.replace('../commande/' + reponse.numero_commande + '&' + reponse.dossier_client + "#ajouterProduit");
        }).fail(function()
        {
           alert("Une erreur est survenue.");
        });
    }
}

function supprimerCommande(numero_commande, dossier_client)
{
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
    }).done(function()
    {
        $('#tableauCommande').DataTable().destroy();
        obtenirCommandeClient(dossier_client);
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function afficherDetailCommande(numero_commande, dossier)
{
    $.ajax({
        url: '../detailClientModification',
        type: 'post',
        dataType: 'json',
        data: 
        {
            numero_commande: numero_commande,
            dossier_client: dossier
        },
        headers: 
        {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(reponse)
    {
        $("#identiteModifier").html(reponse.nom_client_facture);
        $("#telModifier").html(reponse.telephone_client_facture);
        $("#emailModifier").html(reponse.mail_client_facture);
        $("#adresseModifier").html(reponse.adresse1_client_facture);
        $("#complementModifier").html(reponse.adresse2_client_facture);
        $("#code_postalModifier").html(reponse.code_postal_client_facture);
        $("#villeModifier").html(reponse.ville_client_facture);
        $("#referenceModifier").val(reponse.reference_commande);
        $("#commandeOuDevisModifier").val(reponse.type_commande);
        $("#notesModifier").val(reponse.commentaire_commande);
        $("#nomLivraisonModifier").val(reponse.nom_livraison);
        $("#prenomLivraisonModifier").val(reponse.prenom_livraison);
        $("#telephoneLivraisonModifier").val(reponse.telephone_livraison);
        $("#emailLivraisonModifier").val(reponse.mail_livraison);
        $("#adresseLivraisonModifier").val(reponse.adresse1_livraison);
        $("#adresseLivraisonDeuxModifier").val(reponse.adresse2_livraison);
        $("#villeLivraisonModifier").val(reponse.ville_livraison);
        $("#codePostalLivraisonModifier").val(reponse.code_postal_livraison);
        $("#numero_commande").html(reponse.numero_commande);
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function modifierCommande(numero_commande)
{   
    var reference_commande = $("#referenceModifier").val();
    var type_commande = $("#commandeOuDevisModifier").val();
    var commentaire_commande = $("#notesModifier").val();
    var nom_livraison = $("#nomLivraisonModifier").val();
    var prenom_livraison = $("#prenomLivraisonModifier").val();
    var telephone_livraison = $("#telephoneLivraisonModifier").val();
    var email_livraison = $("#emailLivraisonModifier").val();
    var adresse1_livraison = $("#adresseLivraisonModifier").val();
    var adresse2_livraison = $("#adresseLivraisonDeuxModifier").val();
    var ville_livraison = $("#villeLivraisonModifier").val();
    var code_postal_livraison = $("#codePostalLivraisonModifier").val();

    if(reference_commande.length > 25)
    {
        alert("La référence comporte trop de caractères (25 maximum).");
    }

    else if(nom_livraison.length > 40)
    {
        alert("Le nom comporte trop de caractères (40 maximum).");
    }

    else if(prenom_livraison.length > 40)
    {
        alert("Le prénom comporte trop de caractères (40 maximum).");
    }

    else if(ville_livraison.length > 26)
    {
        alert("La ville comporte trop de caractères (26 maximum).");
    }

    else if(adresse1_livraison.length > 30)
    {
        alert("L'adresse de livraison comporte trop de caractères (30 maximum).");
    }
    
    else if(code_postal_livraison.length > 5)
    {
        alert("Le code postal comporte trop de caractères (5 maximum).");
    }

    else if(adresse2_livraison.length > 30)
    {
        alert("Le complément d'adresse comporte trop de caractères (30 maximum).");
    }

    else if(reference_commande == "")
    {
        alert("Veuillez remplir la référence de la commande");
    }

    else if(nom_livraison == "" || adresse1_livraison == "" || ville_livraison == "" || code_postal_livraison == "")
    {
        alert("Veuillez remplir la partie 'Livraison'.");
    }

    else
    {
        $(".modifierCommande").modal('hide');
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
        }).done(function()
        {
            $('#tableauCommande').DataTable().destroy();
            obtenirCommandeClient(recupererDossierClient(id_inverse));
        }).fail(function()
        {
            alert("Une erreur est survenue");
        });
    }
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
        verifierCommandeCloturer(recupererNumCommande(id_inverse), detailCommande);
    }).fail(function()
    {
        alert("Une erreur est survenue");
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
        genererTableauDetailCommande(detailCommande, reponse.cloturer_commande);
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function genererTableauDetailCommande(detailCommande, cloturer_commande)
{
    $("#corpsDetailCommande").empty();
    var total = 0;

    if(cloturer_commande == "" && genererColonneOptions == true && page_courante != "consulterCommande")
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
            stock = detailCommande[i].stock01 + " (Frn : " + detailCommande[i].stock02 + ")";
        }
        else 
        {
            stock = detailCommande[i].stock01 + " (Frn : " + detailCommande[i].stock02 + ") " + detailCommande[i].commentaire_produit;
        }

        if(detailCommande[i].prix_unitaire == 0)
        {
            gratuit = "Oui";
        }
        else
        {
            gratuit = "";
        }

        if(cloturer_commande == 'IPAD' || page_courante == "consulterCommande")
        {
            $("#corpsDetailCommande").append(
                "<tr>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].code_societe + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].reference_produit + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + " designation'>" + detailCommande[i].designation_produit + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + parseInt(detailCommande[i].quantite) + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + detailCommande[i].prix_unitaire + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + stock + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + "'>" + gratuit + "</td>" +
                    "<td class='" + detailCommande[i].reference_produit + " total' data-total='" + totalLigne + "'>" + totalLigne.toFixed(2) + "</td>" +
                "</tr>"
            );
        }
        
        else
        {
            $("#corpsDetailCommande").append(
                "<tr>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + detailCommande[i].code_societe + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + detailCommande[i].reference_produit + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='designation ligneDetailCommande'>" + detailCommande[i].designation_produit + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + parseInt(detailCommande[i].quantite) + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + detailCommande[i].prix_unitaire + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + stock + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='ligneDetailCommande'>" + gratuit + "</td>" +
                    "<td data-produit='" + detailCommande[i].reference_produit + "' class='total ligneDetailCommande' data-total='" + totalLigne + "'>" + totalLigne.toFixed(2) + "</td>" +
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

    afficherDetailProduit(detailCommande);
    $(".afficherTotal").empty();
    $(".afficherTotal").append("Total : " + total.toFixed(2) + " €");
    $('#tableauDetailCommande').DataTable();
}

function obtenirProduits(dossier)
{
    $.ajax({
        url : '../listeProduits/' + dossier,
        type : 'POST',
        dataType : "json",
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
        console.log(produits);
        for(var i = 0; i < produits.length; i++)
        {
            $("#suggestion_produit").append("<option value='" + produits[i].numero_produit + "'>" + produits[i].numero_produit + " [" + produits[i].designation_produit + "]" + "</option>");
        }

        $("#referenceProduit").on('input', function() //cette fonction récupere le prix unitaire du produit (dans le tableau associatif produits)
        {                                            //quand on sélectionne une référence
            var inputValue = this.value;
            if($('datalist').find('option').filter(function()
            {
                return this.value == inputValue;        
            }).length) {
                for(var i = 0; i < produits.length; i++)
                {
                    if(this.value == produits[i].numero_produit)
                    {
                        $("#prixProduit").val(produits[i].prix_unitaire);
                        break;
                    }
                }
            }
        });
    }).fail(function()
    {
        alert("Une erreur est survenue");
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
        
        if ($('#gratuitProduit').prop("checked"))
        {
            gratuit = "oui";
        }

        if(prix_unitaire == "")
        {
            prix_unitaire = 0;
        }
        
        $("#referenceProduit").val("");
        $('#quantiteProduit').val("1");
        $("#prixProduit").val("");
        $('#gratuitProduit').prop("checked", false);

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
            obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse), reference_produit);
        }).fail(function()
        {
            alert("Une erreur est survenue");
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
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

function formulaireModification(ligneCommande)
{
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
    }).done(function()
    {   
        $('#tableauDetailCommande').DataTable().destroy();
        obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse))
    }).fail(function()
    {
        alert("Une erreur est survenue");
    })
}

function afficherDetailProduit(produit)
{
    if(afficher_dernier_produit == true)
    {
        $("#dernierLigneSaisie").show();
        $("#infoAjoutLigneCommande").show();
        $("#referenceProduitAjout").empty();
        $("#quantiteProduitAjout").empty();
        $("#prixUnitaireProduit").empty();
        $("#stockProduitAjout").empty();
    
        var listeCellules = [];
        console.log(produit);
        for(var i = 0; i < produit.length; i++)
        {
            if(produit[i].reference_produit == reference_dernier_produit)
            {
                listeCellules.push(produit[i].reference_produit);
                listeCellules.push(produit[i].quantite);
                listeCellules.push(produit[i].prix_unitaire);
                listeCellules.push(produit[i].stock01);
                listeCellules.push(produit[i].stock02);
            }
        }
        
        $("#referenceProduitAjout").append(listeCellules[0] + " Qte : " + listeCellules[1] + 
        " Prix unit : " + listeCellules[2] + " Stock : " + listeCellules[3] + " (Frn : " + listeCellules[4] + ")");
    }

    else
    {
        $("#dernierLigneSaisie").hide();
        $("#infoAjoutLigneCommande").hide();
    }
}

function envoyer_email(numero_commande, dossier)
{
    $.ajax({
        url: '/envoyer_email',
        type: 'post',
        dataType: 'json',
        data:
        {
            numero_commande: numero_commande,
            dossier: dossier
        },
        headers: 
        {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(reponse)
    {
        $("#envoyer_email").append("<a href='mailto:tricky730@gmail.com' subject=''  class='btn'><i class='fas fa-envelope fa-3x'></i></a>");
        
    }).fail(function(err)
    {
        console.log(err)
    })
}


/*
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Fonction pour la page liste des clients d'un commercial
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/


function obtenirListeCommandes(cle_representant)
{
    $.ajax({
        url: '../obtenirClients/' + cle_representant,
            type: 'post',
            dataType: 'json',
            data:
            {
                direction: direction
            },
            statusCode : 
            {
                404:function()
                {
                    alert("Commandes introuvables");
                }
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
    }).done(function(reponse)
    {
        genererTableauCommande(reponse, 1);
        $('#tableauCommande').DataTable({
            "order": [[ 1, "desc" ]]
        });
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}
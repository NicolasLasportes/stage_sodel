//déclaration des variables "globales", dont aura besoin tout le long du document
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
var formulaire_actif = "";
var clignoter;
var afficher_clignoter = false;
var ma_liste_des_produits = [];

for(var i = url_actuelle.length - 1; i >= 0; i--) //on récupère les informations dont on a besoin dans l'url (comme le dossier, le: numero de commande
{                                                                                                                               // ou la clé représentant)
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

function recupererNumCommande(url) //prend en paramètre une variable qui contient toutes les informations dans l'url, les tries et retourne le numero de commande
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

function recupererDossierClient(url) //prend en paramètre une variable qui contient toutes les informations dans l'url, les tries et retourne le dossier du client
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

function recupererCleCommercial(url) //prend en paramètre une variable qui contient toutes les informations dans l'url, les tries et retourne la clé du commercial
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
    nom_commercial = decodeURIComponent(nom_commercial.join(''));

    if(nom_commercial == "code=T")
    {
        direction = true;
        nom_commercial = "Commandes tous secteurs";
    }
    else
    {
        nom_commercial = nom_commercial.replace("intitule=", "").replace("%20", " ");
    }
}

function somme_tableau(tableau) //prend en parametre un tableau, additionne tout son contenu, et retourne le résultat avec maximum 2 décimales
{
    var somme = 0;

    for(var i = 0; i < tableau.length; i++)
    {
        somme += tableau[i];
    }

    return somme.toFixed(2);
}

function faireClignoter(element) //prend en paramètre un élément qu'on souhaite faire clignoter, et le fait clignoter 
{
    clignoter = window.setInterval(function()
    {
        if(afficher_clignoter == true)
        {
            $(element).show();
            afficher_clignoter = false;
        }
        else
        {
            $(element).hide();
            afficher_clignoter = true;
        }
    }, 700);
}

function afficherDate(date) //prend en paramètre une date au format annee/mois/jour et la retourne au format jour/mois/annee
{
    jour = date.substring(8, 10);
    annee = date.substring(0, 4);
    mois = date.substring(5, 7);
    return jour + "/" + mois + "/" + annee;
}


/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Fonctions pour la page des commandes d'un client 
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/


//Prend en paramètre le dossier du client courant, éxécute une requête ajax qui vas récupérer la liste des commandes passés par ce client
//si une erreur se produit pendant la requête une erreur s'affiche à l'écran, sinon elle lance la fonction genererTableauCommande si la liste 
//des commandes n'est pas vide,  
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
        $("#titre_client").empty().append("Commandes de " + listeDesCommandes[listeDesCommandes.length -1].nom_client);
        if(listeDesCommandes[listeDesCommandes.length -1].nom_client != undefined)
        {
            listeDesCommandes.splice(-1, 1);

        }
        if(listeDesCommandes.length >=  0)
        {
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

//Prend en premier paramètre la liste des commandes (qui doit être un tableau associatif contenant des tableaux) et en second un nombre qui détermine l'interface
//à afficher (mon panier ou les commandes d'un client )
function genererTableauCommande(commandes, interface)
{
    var cloturer; 
    var modification;
    var suppression;
    var nom;
    var nom_representant = "";
    $("#corpsTableauCommande").empty();
    if(interface == 1)
    {
        $("#ajouterCommande").hide();
    }
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

        console.log(interface)

        if(interface == 1)
        {
            if(commandes[i].nom_client != commandes[i].nom_client_livraison || commandes[i].adresse_facture != commandes[i].adresse_livraison || commandes[i].ville_facture != commandes[i].ville_livraison || commandes[i].code_postal_livraison != commandes[i].code_postal_facture)
            {
                nom = "<td class='ligneTableauCommandes nom_commande'>" + commandes[i].nom_client + " " + commandes[i].code_postal_livraison + " " + 
                commandes[i].ville_livraison + "<br> Livré à : " + commandes[i].nom_client_livraison + " " + " " + commandes[i].code_postal_livraison + " " +
                commandes[i].ville_livraison + "</td>";
            }
            else
            {
                nom = "<td class='ligneTableauCommandes'>" + commandes[i].nom_client + " " + commandes[i].code_postal_livraison + " " + commandes[i].ville_livraison + "</td>";
            }

            modification = "";
            suppression = "";
            $("#enteteTableauModifier").remove();
            $("#enteteTableauSupprimer").remove();
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

        if(commandes[i].type_commande == "DEV")
        {
            var type_commande = "Devis";
        }

        else
        {
            var type_commande = "Commande";
        }

        $("#corpsTableauCommande").append(
            "<tr>" + 
                modification +
                nom +
                "<td data-dossier='" + commandes[i].dossier + "'id='" + commandes[i].numero_commande + "' class='ligneTableauCommandes numero_commande'>" + 
                    commandes[i].numero_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + commandes[i].reference_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + parseFloat(commandes[i].total).toFixed(2) + "</td>" +
                "<td class='ligneTableauCommandes'>" + type_commande + "</td>" + 
                "<td class='ligneTableauCommandes'>" + afficherDate(commandes[i].date_commande) + "</td>" + 
                "<td class='ligneTableauCommandes'>" + cloturer + "</td>" + 
                "<td class='ligneTableauCommandes'>" + ventiler_commande + "</td>" +
                suppression + 
                nom_representant +
            "</tr>"
        );
    }
}

//Prend en paramètre le numero d'une commande et la clôture
function cloturer_commande(numero_commande)
{
    $.ajax({
        url : '../cloturer_commande',
        type : 'post',
        dataType : "json",
        data: 
        {
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
    }).done(function()
    {
        envoyer_email_cloture(numero_commande)
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

//Prend en paramètre le dossier client, lance une requête ajax pour récupérer les informations du client et les affiche dans la partie "Le client" et "Livraison" du 
//formulaire d'ajout d'une commande
function detailClient(dossier)
{
    $.ajax(
    {
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
        $("#identite").empty();
        $("#tel").empty();
        $("#email").empty();
        $("#adresse").empty();
        $("#identite").append(reponse.nom_client);
        $("#tel").append(reponse.telephone_client);
        $("#email").append(reponse.mail_client);
        $("#adresse").append(
            "<div class='form-row'>" +
                "<div class='col-md-12' id='adresse_client'>" + reponse.nom_voie_client + "</div>" +
            "</div><div class='form-row'>" +
                "<div class='col-md-12' id='complement_adresse_client'>" + reponse.complement + "</div>" +
            "</div><div class='form-row'>" +
                "<div class='col-md-3' id='code_postal_client'>" + reponse.code_postal_client + "</div>" +
                "<div class='col-md-9' id='ville_client'>" + reponse.ville_client + "</div>" +
            "</div>"
        );

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

//Récupère les valeurs du formulaire d'ajout vérifie qu'elles sont valides et les envoies dans la base de données, redirige ensuite l'utilisateur 
//dans la page du détail commande
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

    else if(commentaire.length > 110)
    {
        alert("Le commentaire comporte trop de caractères ( 110 maximum)")
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

//Prend en paramètre le numéro de commande et le dossier d'un client, supprime la commande correspondante de la base de données et régénère le tableau
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

//Prend en paramètre le numéro de commande et le dossier du client, récupère les informations de la commande correspondante dans la base de données
//puis remplis le formulaire de modification avec ces informations
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

//Prend en paramètre le numéro de commande, vérifie les informations saisies par l'utilisateur dans le formulaire de modidication
// et si elles sont valides envoie les modifications dans la base de données avant de regénérer le tableau
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


//Prend en paramètre le numéro de commande et le dossier du client et récupère toutes les lignes de la commande, ainsi que le nom du client et le type de la commande
// (commande ou devis), passes la variable qui contient les lignes de la commande a la fonction verifierCommandeCloturer() (et a envoyer_email qui permet de 
//générer le lien mailTo)
function obtenir_detail_commande(id_commande, id_client)
{
    $.ajax({
        url : '../detail_commande_client/' + id_commande + "&" + id_client,
        type : 'post',
        contentType : "application/json",
        dataType: 'json',
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
    }).done(function(detail_commande)
    {
        if(detail_commande.type_commande == "DEV")
        {
            $("#titre_commande").empty().append("Devis n°" + recuperer_num_commande(id_inverse) + " de " + detail_commande.nom_client);
        }
        else
        {
            $("#titre_commande").empty().append("Commande n°" + recuperer_num_commande(id_inverse) + " de " + detail_commande.nom_client);
        }
        delete detail_commande.nom_client;
        verifier_commande_cloturer(recuperer_num_commande(id_inverse), detail_commande);
        envoyer_email(recuperer_num_commande(id_inverse), recuperer_dossier_client(id_inverse));
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

//Prend en paramètre le numéro de la commande ainsi que la détail de cette commande (précédent passé par obtenirDetailCommande), elle vérifie si la commande est
//clôturé ou non, passe une variable qui contient la réponse (paramètre 2) et le détail de la commande (paramètre 1) a la fonction genererTableauDetailCommande
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
        console.log(reponse)
        genererTableauDetailCommande(detailCommande, reponse.cloturer_commande);
    }).fail(function()
    {
        alert("Une erreur est survenue");
    });
}

//Prend en paramètre le détail de la commande et la variable cloturer_commande et génère le tableau en fonction des informations reçues
function genererTableauDetailCommande(detailCommande, cloturer_commande)
{
    $("#corpsDetailCommande").empty();
    var total = 0;    
    
    if(cloturer_commande == "" && genererColonneOptions == true)
    {
        if($("#pourcentageRemise").val() == 0) 
        {    
            $("#pourcentageRemise").val('');
        }
        if(page_courante != "consulterCommande")
        {
            $("#afficherFormAjoutProduit").show();
            $("#headerDetailCommande").append("<th id='administrationDetailCommande' class='enteteTableauDetailCommande'>Supprimer</th>");
        }

        $("#cloturerCommande").show();
        genererColonneOptions = false;
    }

    delete detailCommande.type_commande;

    for(var i in detailCommande)
    {
        var stock; 
        var totalLigne = detailCommande[i].prix_unitaire * detailCommande[i].quantite;

        if(detailCommande[i].stock01 === undefined && detailCommande[i].stock02 === undefined)
        {
           stock = "";
        }
        else if(detailCommande[i].stock02 === undefined && detailCommande[i].commentaire_produit === undefined)
        {
            stock = detailCommande[i].stock01;
        }
        else if(detailCommande[i].commentaire_produit === undefined)
        {
            stock = detailCommande[i].stock01 + " (Frn=" + detailCommande[i].stock02 + ")";
        }
        else 
        {
            stock = detailCommande[i].stock01 + " (Frn=" + detailCommande[i].stock02 + ") " + detailCommande[i].commentaire_produit;
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

    $(".afficherTotal").empty();
    $(".afficherTotal").append("Total : " + total.toFixed(2) + " €");
    $('#tableauDetailCommande').DataTable();
}

//Prend en paramètre le dossier du client et récupère la liste de tous les produits (ainsi que les tarifs, les prix par quantités, les stocks) de ce client
//crée également les évènements pour que le prix unitaire du produit se rentre automatiquement quand on rentre un référence et se modifie s'il y a un prix
//par quantité quand on rentre la quantité
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
        console.log(produits)
        $(".chargementProduits").empty();
        clearInterval(clignoter);
        var produits_sans_prix_speciaux = [];
        var dernier_produit = "";
        var liste_produits = [];
        var prix_a_modifier;
        var code_combinaison = "";
        var produit_actuel;
        ma_liste_des_produits = produits;

        for(var i = 0; i < produits.length ; i++)
        {
            if(dernier_produit != produits[i].numero_produit)
            {
                produits_sans_prix_speciaux.push(produits[i]);
                dernier_produit = produits[i].numero_produit;
            }
        }

        for(var i = 0; i < produits_sans_prix_speciaux.length; i++)
        {
            liste_produits.push(produits_sans_prix_speciaux[i].numero_produit + " [" + produits_sans_prix_speciaux[i].designation_produit + "]" + 
            " [Mir: " + produits_sans_prix_speciaux[i].stock01 + ", Frn: " + produits_sans_prix_speciaux[i].stock02 + "]");
        }

        if($("#formulaireAjouterLigneCommande").is(":visible"))
        {
            console.log("je suis visible")
            prix_a_modifier = "#prixProduit";
            code_combinaison = "#code_combinaison_produit";
        }
        
        else if ($("#formulaireModifierLigneCommande").is(":visible"))
        {
            console.log("modification visible")
            prix_a_modifier = "#prixProduitLigne";
            code_combinaison = "#code_combinaison_produit_modifier";
            produit_actuel = $("#referenceProduitLigne").val();
    
            for(var i = 0; i < produits_sans_prix_speciaux.length; i++)
            {
                if(produit_actuel == produits_sans_prix_speciaux[i].numero_produit)
                {
                    produit_actuel = produits_sans_prix_speciaux[i];
                    if(produit_actuel.code_combinaison == "S")
                    {
                        $(code_combinaison).val("S");
                        break;
                    }
                }
            }
        }

        $("#formulaireModifierLigneCommande").on('shown.bs.modal', function()
        {
            console.log("formulaire modification")
            prix_a_modifier = "#prixProduitLigne";
            code_combinaison = "#code_combinaison_produit_modifier";
            produit_actuel = $("#referenceProduitLigne").val();
    
            for(var i = 0; i < produits_sans_prix_speciaux.length; i++)
            {
                if(produit_actuel == produits_sans_prix_speciaux[i].numero_produit)
                {
                    produit_actuel = produits_sans_prix_speciaux[i];
                    if(produit_actuel.code_combinaison == "S")
                    {
                        $(code_combinaison).val("S");
                        break;  
                    }
                }
            }    
        });
    
        $("#formulaireAjouterLigneCommande").on('shown.bs.modal', function()
        {
            console.log("frmulaire ajout")
            prix_a_modifier = "#prixProduit";
            code_combinaison = "#code_combinaison_produit";
        });

        new Awesomplete(document.getElementById("reference_produit"), 
        {
            list: liste_produits,
            maxItems: liste_produits.length,
            minChars: 1
        });

        $("#awesomplete_list_1").on('click', function()
        {
            var produit_choisi = $("#reference_produit").val();
            produit_choisi = produit_choisi.slice(0, produit_choisi.indexOf("[") - 1);
            $("#reference_produit").val(produit_choisi);

            for(var i = 0; i < produits_sans_prix_speciaux.length; i++)
            {
                if(produit_choisi == produits_sans_prix_speciaux[i].numero_produit)
                {
                    produit_actuel = produits_sans_prix_speciaux[i];
                    $("#prix_produit").val(produit_actuel.prix_unitaire)
                    if(produit_actuel.code_combinaison == "S")
                    {
                        $(code_combinaison).val("S");
                    }
                }
            }
        });
        
        $("#quantite_produit, #quantite_produit_ligne").on('input', function() //cette fonction récupere le prix unitaire du produit (s'il a un code_combinaison == "S")
        {                                                                  //quand on sélectionne la quantité                                            
            var quantite_demande = this.value;
            if($(code_combinaison).val() == "S")
            {
                for(var i = 0; i < produits.length; i++)
                {
                    if(produit_actuel.numero_produit == produits[i].numero_produit && parseInt(produits[i].quantite) >= quantite_demande)
                    {
                        $(prix_a_modifier).val(produits[i].prix_unitaire);
                        break; 
                    }
                }
            }
        });
    }).fail(function(err)
    {
        console.log(err)
        alert("Une erreur est survenue");
    });
}

//Récupère les valeurs du formulaire d'ajout d'une ligne commande, vérifie qu'elles sont valides, et les insère dans la base de données et regénère le tableau
function ajouterLigne()
{
    var produit_existe = false;
    if($("#pourcentageRemise").val() == '')
    {
        var remise = 0;
    }
    else
    {
        var remise = $("#pourcentageRemise").val();
    }

    if($("#referenceProduit").val() != "")
    {
        for( var i = 0; i < ma_liste_des_produits.length; i++)
        {
            if($("#referenceProduit").val() == ma_liste_des_produits[i].numero_produit)
            {
                produit_existe = true;
                break;
            }
        }
    }
    else
    {
        alert("Veuillez saisir un produit valide"); 
    }

    if($("#quantiteProduit").val() == "" || $("#quantiteProduit").val() <= 0)
    {
        alert("Veuillez saisir une quantité supérieure à 0");
    }
    else if($("#quantiteProduit").val() > 99999)
    {
        alert("Veuillez saisir une quantité inférieure à 99 999");
    }
    else if ($("#prixProduit").val() == '' || $("#prixProduit").val() < 0)
    {
        alert("Veuillez saisir un prix unitaire valide");
    }
    else if(!$.isNumeric(remise))
    {
        alert("La remise ne doit contenir que des caractères numériques");
    }
    else if(remise < 0)
    {
        alert("Veuillez choisir une remise supérieure à 0");
    }
    else if(remise > 100)
    {
        alert("Veuillez choisir une remise inférieure à 100");
    }
    else if(produit_existe == false)
    {
        alert("Le référence produit n'est pas valide");
    }
    else
    {
        var reference_produit = $("#referenceProduit").val();
        var quantite = $("#quantiteProduit").val();
        var prix_unitaire = $("#prixProduit").val();
        var code_combinaison = $("#code_combinaison_produit").val();
        var numero_commande = recupererNumCommande(id_inverse); //la variable numero_commande contient le n° de commande actuel récupéré dans l'url
        var dossier = recupererDossierClient(id_inverse);
        
        prix_unitaire = prix_unitaire - (prix_unitaire * remise / 100);
        
        $("#referenceProduit").val("");
        $('#quantiteProduit').val("1");
        $("#prixProduit").val("");
        $("#pourcentageRemise").val("");

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
                code_combinaison: code_combinaison
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }).done(function(reponse)
        {
            $('#tableauDetailCommande').DataTable().destroy();
            afficherDetailProduit(reponse);
            obtenirDetailCommande(recupererNumCommande(id_inverse), recupererDossierClient(id_inverse));
        }).fail(function(err)
        {
            console.log(err)
            alert("Une erreur est survenue");
        });

    }
}

//Prend en paramètre la référence d'un produit, récupère le numéro de la commande courante et supprime la ligne relative a cette commande et regénère le tableau
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

//Prend en paramètre un tableau contenant les valeurs de la ligne sélectionné dans le tableau du détail d'une commande et remplie le formulaire de modification avec
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

//Prend en paramètre le code société du produit, récupère les valeurs du formulaire de modification et les envoie dans la base de données puis regénère le tableau
function modifierLigneCommande(code_societe)
{
    var code_produit = $("#referenceProduitLigne").val();
    var quantite =  $("#quantiteProduitLigne").val();
    var prix_unitaire = $("#prixProduitLigne").val();
    if($("#pourcentageRemiseLigne").val() == '')
    {
        var remise = 0;
    }
    else
    {
        var remise = $("#pourcentageRemiseLigne").val();
    }

    if($("#referenceProduitLigne").val() == "")
    {
        alert("Veuillez saisir un produit valide"); 
    }
    else if($("#quantiteProduitLigne").val() == "" || $("#quantiteProduit").val() <= 0)
    {
        alert("Veuillez saisir une quantité supérieure à 0");
    }
    else if($("#quantiteProduitLigne").val() > 99999)
    {
        alert("Veuillez saisir une quantité inférieure à 99 999");
    }
    else if ($("#prixProduitLigne").val() == '' || $("#prixProduitLigne").val() < 0)
    {
        alert("Veuillez saisir un prix unitaire valide");
    }
    else if(!$.isNumeric(remise))
    {
        alert("Veuillez saisir un nombre valide");
    }
    else if(remise < 0)
    {
        alert("Veuillez choisir une remise supérieure à 0");
    }
    else if(remise > 100)
    {
        alert("Veuillez choisir une remise inférieure à 100");
    }
    else
    {
        $("#pourcentageRemiseLigne").val("");
        prix_unitaire = prix_unitaire - (prix_unitaire * remise / 100);

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
}

//Prend en paramètre un produit (prix quantite stock reference) et l'affiche en dessous du formulaire d'ajout dans la ligne : "Derniere ligne saisie"
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

        for(var i in produit)
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
        " Prix unit net: " + parseFloat(listeCellules[2]).toFixed(2) + " Stock : " + listeCellules[3] + " (Frn : " + listeCellules[4] + ")");
    }

    else
    {
        $("#dernierLigneSaisie").hide();
        $("#infoAjoutLigneCommande").hide();
    }
}

//Prend en paramètre le numéro de commande et le dossier du client et génère le lien mailTo qui permet d'ouvrir la messagerie par défaut et d'avoir un mail
//prérempli avec les informations de la commande
function envoyer_email(numero_commande, dossier)
{
    $.ajax({
        url: '../envoyer_email',
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
        console.log(reponse.commentaire_commande)
        if(reponse.type_commande == "CDE")
        {
            var type_commande = "Commande";
        }
        else
        {
            var type_commande = "Devis";
        }
        var objet_email = type_commande + "%20n°" + reponse.numero_commande + "%20du%20" + afficherDate(reponse.date) + "%20V/Ref:%20" + reponse.reference_commande;
        var adresse_mail = reponse.mail_facture;
        if( reponse.nom_facture != reponse.nom_livraison || reponse.adresse1_facture != reponse.adresse1_livraison || reponse.adresse2_facture != reponse.adresse2_livraison || reponse.code_postal_facture != reponse.code_postal_livraison || reponse.ville_facture != reponse.ville_livraison)
        {
            var corps_email = reponse.nom_facture + 
            "%0D%0A" + reponse.adresse1_facture +
            "%0D%0A" + reponse.adresse2_facture + 
            + reponse.code_postal_facture + "&nbsp;" + reponse.ville_facture +
            "%0D%0A%0D%0ALivré à %20%3A" +
            "%0D%0A" + reponse.nom_livraison + 
            "%0D%0A" + reponse.adresse1_livraison +
            "%0D%0A" + reponse.adresse2_livraison + 
            + reponse.code_postal_livraison + "&nbsp;" + reponse.ville_livraison +
            "%0D%0A%0D%0A" + objet_email + "%0D%0A" + reponse.commentaire_commande;
        }

        else
        {
            var corps_email = reponse.nom_facture + 
            "%0D%0A" + reponse.adresse1_facture +
            "%0D%0A" + reponse.adresse2_facture + 
            + reponse.code_postal_facture + "&nbsp;" + reponse.ville_facture +
            "%0D%0A%0D%0A" + objet_email + "%0D%0A" + reponse.commentaire_commande;
        }

        delete reponse.numero_commande;
        delete reponse.date;
        delete reponse.reference_commande;
        delete reponse.nom_facture;
        delete reponse.adresse1_facture;
        delete reponse.adresse2_facture;
        delete reponse.code_postal_facture;
        delete reponse.ville_facture;
        delete reponse.nom_livraison;
        delete reponse.adresse1_livraison;
        delete reponse.adresse2_livraison;
        delete reponse.code_postal_livraison;
        delete reponse.ville_livraison;
        delete reponse.pays_facture;
        delete reponse.pays_livraison;
        delete reponse.commentaire_commande;
        delete reponse.mail_facture;
        delete reponse.mail_livraison;
        delete reponse.prenom_livraison;
        delete reponse.telephone_facture;
        delete reponse.telephone_livraison;
        delete reponse.type_commande;

        var ligne_produit = [];
        var total = [];
        for (var cle in reponse) 
        {
            if(reponse[cle].prix_unitaire < 1)
            {
                prix_unitaire = parseFloat("0" + reponse[cle].prix_unitaire);
            }
            else 
            {
                prix_unitaire = reponse[cle].prix_unitaire;
            }

            ligne_produit.push("%0D%0A%0D%0A" + reponse[cle].quantite + "&nbsp;" + reponse[cle].reference_produit + "&nbsp;à&nbsp;" + prix_unitaire + "%20h.t" + 
            "%0D%0A" + reponse[cle].designation_produit);
            total.push(reponse[cle].quantite * reponse[cle].prix_unitaire);
        }

        var afficher_total = "%0D%0A%0D%0ATotal%20:%20" + somme_tableau(total) + "%20€%20Hors%20taxes%20marchandises%20(En%20supplément%20:%20éco-contribution%20et%20frais%20de%20port%20éventuels)";
        $("#envoyer_email").empty().append(
            "<a href='mailto:" + adresse_mail + "?subject=" + objet_email + "&body=" + corps_email + ligne_produit.join('') + afficher_total +
            "' class='btn'><i class='fas fa-envelope fa-3x'></i></a>"
        );
        
    }).fail(function()
    {
        alert("une erreur est survenue")
    })
}

//Prend en paramètre le numéro de commande et envoi un mail quand la commande est cloturée et redirige l'utilisateur à la page précédente
function envoyer_email_cloture(numero_commande)
{
    console.log(numero_commande)
    $.ajax(
    {
        url: '../envoyer_email_cloture',
        type: 'post',
        dataType: 'json',
        data:
        {
            numero_commande: numero_commande
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(reponse)
    {
        console.log(reponse)
        window.location.href = document.referrer;
    }).fail(function()
    {
        alert("Une erreur est survenue")
    })
}

/*
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Fonction pour la page (mon panier) liste des clients d'un commercial
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

//Prend en paramètre la clé représentant, récupère toutes les commandes de ce représentant et les passes a la fonction qui génère notre tableau
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
$(document).ready(function()
{
    recupererProformas(direction, soustraireDate(dateFormatBdd, parseInt($("#dernieresProformas").val())).toISOString().slice(0,10));

    //au clic sur le bouton avec l'id = rechargerProformas, on lance la fonction recupererProformas();
    $("#rechargerProformas").on("click", function()
    {
        recupererProformas(direction, soustraireDate(dateFormatBdd, parseInt($("#dernieresProformas").val())).toISOString().slice(0,10));
    });

    //au clic sur le bouton d'id = boutonFermeture, ferme l'onglet courante
    $("#boutonFermeture").on('click', function()
    {
        window.close();
    });

    //$("#modificationCommentaire").append(" " + dateFormatBdd);
 
    //au clic sur une cellule du tableau, récupère le nom du client, le numero de la proforma, le code societe, le numero du client, et verifie si un suivi
    //pour cette proforma existe ou pas
    //et une fois tout cela fait, lance la fonction informationsContact() avec en paramètrele numero de client et le numero de proforma
    $("#example").delegate('.celluleTableauProformas', 'click', function()
    {
        $('#formulaireSuiviProformas').modal('show');
        $.when(
            $(this).parent().find('td').each(function()
            {
                if($(this).hasClass("raisonSociale"))
                {
                    nomClient = $(this).text();
                }
                
                if($(this).hasClass("codeSociete"))
                {
                    $("#codeSociete").val($(this).text());
                }
                
                if($(this).hasClass("numeroOrdre"))
                {
                    numeroProforma = $(this).text();
                    $("#numeroPiece").val($(this).text());
                }
                
                if($(this).hasClass("numeroClient"))
                {
                    numeroClient = $(this).text();
                    $("#numeroClient").val($(this).text());
                }
                
                if($(this).hasClass("archiverProforma") || $(this).hasClass("cloturerProforma") || $(this).hasClass("prochaineAction") || $(this).hasClass("dateCommentaire") || $(this).hasClass("commentaire")) 
                {
                    if($(this).text() != "")
                    {
                        ajouter = false;
                    }
                }
                
            })
        ).then(function()
        {
            informationsContact(numeroClient, numeroProforma);
        });
    });

    /*
    au clic sur le bouton d'id = enregistrerProforma, vérifie toutes les valeurs saisies dans le formulaire,
    une fois les tests passés, lance la fonction ajouterOuModifier() et lui passe en paramètre les informations récupérés précédement
    */
    $("#enregistrerProforma").on('click', function()
    {
        if($("#cloturerProforma").is(":checked") && $("#pourquoiCloturerProforma").val() == "" || $("#cloturerProforma").is(":checked") && $("#pourquoiCloturerProforma").val() == " ")
        {
            alert("Vous devez remplir le champ 'pourquoi' si vous souhaitez clôturer cette commande");
            return false;
        }
        else if($("#commentaireProforma").val().length > 300)
        {
            alert("Le commentaire ne peut comporter que 300 caractères maximum.");
        }
        else if($("#nombreDeJours").val() <= 0 && $("#dateProchaineAction").val() == "" && $("#cloturerProforma").prop("checked") == false && $("#archiverProforma").prop("checked") == false)
        {
            alert("Veuillez rentrer ou un nombre de jours ou la date de la prochaine action");
            return false;
        }
        else if($("#pourquoiCloturerProforma").val().length > 100)
        {
            alert("Le commentaire de clôture ne peut comporter que 100 caractères maximum");
            return false;
        }
        else if($("#commentaireArchiverProforma").val().length > 100)
        {
            alert("Le commentaire d'archive ne peut comporter que 100 caractères maximum");
            return false;
        }
        else if($("#commentaireArchiverProforma").val() != "" && $("#archive").prop("checked") === false)
        {
            alert("Vous ne pouvez pas rentrer de commentaire d'archive si vous ne cochez pas la case 'Archiver'");
            return false;
        }
        else if($("#pourquoiCloturerProforma").val() != "" && $("#cloturerProforma").prop("checked") == false)
        {
            alert("Vous ne pouvez pas rentrer de commentaire de clôture si vous ne cochez pas la case 'Clôturer'");
            return false;
        }
        else
        {
            $("#ajouterOuModifier").val(ajouter);
            var codeSociete = $("#codeSociete").val();
            var numeroClient = $("#numeroClient").val();
            var numeroProforma = $("#numeroPiece").val();
            ajouterOuModifier(ajouter, codeSociete, numeroClient, numeroProforma, "");
        }
    });

    /*
    récupère le nombre saisie a chaque changement dans l'input d'id = nombreDeJours, et calcule la date de prochaine action grace a la fonction
    ajouterNombreDeJour, cette date est convertie au format yyyy-mm-dd et affiché dans l'input correspondant    
    */
    $("#nombreDeJours").on('input', function()
    {
        nombreDeJoursSaisis = $(this).val();
        var dateProchaineAction = ajouterNombreJour(dateDuJour, nombreDeJoursSaisis);
        dateProchaineAction = formatDateValide(dateProchaineAction);
        $("#dateProchaineAction").val(dateProchaineAction);
    });
});

//prend en parametre un objet date et retourne une date au format yyyy-mm-dd
function formatDateValide(date)
{
    var jour = date.getDate();
    if(jour < 10)
    {
        jour = "0" + jour;
    }
    var mois = date.getMonth() + 1;
    if(mois < 10)
    {
        mois = "0" + mois;
    }
    var annee = date.getFullYear();
    var dateDuJour = annee + "-" + mois + "-" + jour;
    return dateDuJour;
}

//prend en parametres une date et un nombre de jours, ajoute les 2, et retourne la date obtenu
function ajouterNombreJour(date, nbrJours)
{
    nbrJoursMilliSecondes = 86400000 * nbrJours;
    var tempsDate = date.getTime();
    tempsDate += nbrJoursMilliSecondes;
    dateProchaineAction = new Date(tempsDate);
    return dateProchaineAction;
}

//prend en parametre le nom du client, le numero de proforma et les informations récupérées
function remplirFormulaire(nomClient, numeroProforma, informations)
{
    $("#titreFormulaireSuiviProformas").empty().append("<div id='nomClient'>" + nomClient + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='numeroProforma'>Devis n°" + numeroProforma + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='nomContact'>" + informations.nomContact + "</div>");
    $("#titreFormulaireSuiviProformas").append("<div id='telephoneContact'>" + informations.telephoneContact + "</div>");
    $("#dateDeniereModification").empty().append("Modifié le : " + informations.derniereModification);
    $("#commentaireProforma").val("");
    $("#nombreDeJours").val("");
    if(informations.prochaineAction != "0001-01-01")
    {
        $("#dateProchaineAction").val(informations.prochaineAction);
    }
    else
    {
        $("#dateProchaineAction").val("");
    }

    if(informations.cloture != "0001-01-01" && informations.cloture != "")
    {
        $("#cloturerProforma").prop("checked", true);
        $("#pourquoiCloturerProforma").val(informations.commentaireCloture);
    }
    else
    {
        $("#cloturerProforma").prop("checked", false);
        $("#pourquoiCloturerProforma").val("");
    }
    if(direction === "&code=T")
    {
        if(informations.archive != "0001-01-01" && informations.archive != "")
        {
            $("#archiverProforma").prop("checked", true);
            $("#commentaireArchiverProforma").val(informations.commentaireArchive);
        }
        else
        {
            $("#archiverProforma").prop("checked", false);
            $("#commentaireArchiverProforma").val("");
        }
    }
    $("#titreFormulaireSuiviProformas").css("font-size", "16px");
    $("#listeAnciensCommentaires").val(informations.commentaire);
    anciensCommentaires = afficherCommentaires(informations.commentaire).reverse();
    var listeCommentaires = "";
    for(var i = 0; i < anciensCommentaires.length; i++)
    {
        listeCommentaires = listeCommentaires.concat("", anciensCommentaires[i] + "\n")
    }
    $("#ancienCommentaireProforma").val(listeCommentaires);
}

/*
Prend en parametre une chaine de caractères qui contient l'information si l'utilisateur est un membre de la direction ou non
et en deuxième paramètre une chaine de caractère qui contient une date au format yyyy-mm-dd
la fonction envoie ces 2 paramètres a un api php a l'aide d'une requete ajax
et retourne la liste des proformas (en fonction des paramètres fournis)
*/
function recupererProformas(direction, dateLimite)
{
    //verifie toutes les 0,7sec si la ligne contenant "Chargement des proformas en cours" est affichée ou cachée
    //(permet de créer l'effet de clignotement)
    //si elle est affichée, on la cache
    //si elle est cachée, on l'affiche
    var chargementDesProformas = setInterval(function() 
    {
        if($("#informationsChargement").is(":visible"))
        {
            $("#informationsChargement").hide();
        }
        else
        {
            $("#informationsChargement").show();
        }
    }, 700);

    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/proforma/proforma.php" + $(location).prop('search'),
        type: "post",
        dataType: "json",
        data:
        {
            direction: direction,
            dateLimite: dateLimite
        }
    }).done(function(reponse)
    {
        console.log(reponse)
        if(generationTableauPremiereFois == true)
        {
            clearInterval(chargementDesProformas);
            if($("#informationsChargement").is(":hidden"))
            {
                $("#informationsChargement").show();
            }
            genererTableau(reponse);
            generationTableauPremiereFois = false;
        }
        else
        {
            clearInterval(chargementDesProformas);
            $('#example').DataTable().destroy();
            genererTableau(reponse);
        }
    }).fail(function(err)
    {
        console.log(err)
        $("#informationsChargement").empty().append("Impossible de récupérer les proformas");
    });
}

/*
Prend en paramètre un tableau d'objets contenant la liste des proformas récupérés par la fonction recupererProformas() et génère le tableau en fonction
des informations reçues
*/
function genererTableau(proformas)
{
    var joursInaction = 0;
    if(direction === "&code=T")
    {
        var enteteCloture = "<th class='tableHeader' id='tdHeader10'>Cloturé</th>";
    }
    else
    {
        enteteCloture = "";
    }
    $("#enteteTableauProformas").empty().append(
        "<tr>" +
            "<th class='tableHeader' id='tdHeader1'>Rep</th>" +
            "<th class='tableHeader' id='tdHeader2'>Sté</th>" +
            "<th class='tableHeader' id='tdHeader3'>N Clt</th>" +
            "<th class='tableHeader' id='tdHeader4'>Raison sociale</th>" +
            "<th class='tableHeader' id='tdHeader5'>Date</th>" +
            "<th class='tableHeader' id='tdHeader6'>Type</th>" +
            "<th class='tableHeader' id='tdHeader7'>N° de pièce</th>" +
            "<th class='tableHeader' id='tdHeader8'>H.T</th>" +
            "<th class='tableHeader' id='tdHeader9'>Référence</th>" +
            enteteCloture +
            "<th class='tableHeader' id='tdHeader12'>Nbre Jours d'inaction <div id='cliquezIci'>cliquez-ici</div></th>" +	
            "<th class='tableHeader' id='tdHeader13'>Prochaine action</th>" +
            "<th class='tableHeader' id='tdHeader14'>Date derniere modif </th>" +				
            "<th class='tableHeader' id='tdHeader15'>Commentaire</th>" +
        "</tr>"
    );

    $("#corpsTableauProformas").empty();
    for(var i = 0; i < proformas.length; i++)
    {
        if(direction != "&code=T")
        {
            cloture = "";
        }
        else if(proformas[i].cloture != "0001-01-01" && proformas[i].cloture != false)
        {
            cloture = "<td class='celluleTableauProformas cloturerProforma'>" + proformas[i].cloture + "</td>";
        }
        else
        {
            cloture = "<td class='celluleTableauProformas cloturerProforma'></td>";
        }

        if(proformas[i].prochaineAction == false || proformas[i].prochaineAction == "0001-01-01")
        {
            prochaineAction = "";
        }
        else
        {
            prochaineAction = formaterDate(proformas[i].prochaineAction);
        }
        
        if(proformas[i].derniereModification == false)
        {
            derniereModification = "";
        }
        else
        {
            derniereModification = formaterDate(proformas[i].derniereModification);
        }

        if(proformas[i].commentaire == false)
        {
            commentaire = "";
        }
        else
        {
            commentaire = proformas[i].commentaire.slice(proformas[i].commentaire.lastIndexOf("( Enreg : ") + 23);
        }  

        if(proformas[i].commentaireCloture != "" && proformas[i].commentaireCloture != false)
        {
            commentaire = proformas[i].commentaireCloture;
        }

        if(derniereModification == "" && prochaineAction == "")
        {
            var date = proformas[i].dateCreation.date.slice(0, 10);
            date = new Date(date);
            joursInaction = differenceEntreDates(dateDuJour, date);
        }
        else if(derniereModification != "" && prochaineAction == "")
        {
            joursInaction = differenceEntreDates(dateDuJour, new Date(derniereModification));
        }
        else if(derniereModification == "" && prochaineAction != "")
        {
            joursInaction = differenceEntreDates(dateDuJour, new Date(prochaineAction));
        }
        else
        {
            if(new Date(derniereModification) > new Date(prochaineAction))
            {
                joursInaction = differenceEntreDates(dateDuJour, new Date(derniereModification));
            }
            else
            {
                joursInaction = differenceEntreDates(dateDuJour, new Date(prochaineAction));
            }
        }

        if(joursInaction <= 0)
        {
            joursInaction = "";
        }

        if(direction === "&code=T")
        {
            var representant = "<td class='celluleTableauProformas'>" + proformas[i].nomRepresentant + "</td>";
            var colonneNbrJoursInaction = 10;
            var colonneDerniereModification = 12;
        }
        else
        {
            var representant = "<td class='celluleTableauProformas'>" + proformas[i].numeroRepresentant + "</td>";
            var colonneNbrJoursInaction = 9;
            var colonneDerniereModification = 11;
        }
        $("#corpsTableauProformas").append(
        "<tr class='bodyRows'>" + 
            representant +
            "<td class='celluleTableauProformas codeSociete'>" + proformas[i].codeSociete + "</td>" +
            "<td class='numeroClient'>" + "<a href='" + proformas[i].lienClient + "' target='_blank' style='color:blue'>" + proformas[i].numeroClient + "</td>" +
            "<td class='raisonSociale'>" + proformas[i].raisonSociale + "<i class='fas fa-search-plus fa-1x'></i></td>" +
            "<td class='celluleTableauProformas'>" + formaterDate(proformas[i].dateCreation.date) + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].type + "</td>" +
            "<td class='numeroOrdre'>" +
                "<a href='" + proformas[i].lienPdf + "' target='_blank'><i class='fas fa-file-pdf fa-3x'></i><br>" + proformas[i].numeroProforma +
            "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].horsTaxes + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].reference + "</td>" +
            cloture +
            "<td class='celluleTableauProformas joursInaction'>" + joursInaction + "</td>" +
            "<td class='celluleTableauProformas prochaineAction'>" + prochaineAction + "</td>" +
            "<td class='celluleTableauProformas dateCommentaire'>" + derniereModification + "</td>" +
            "<td class='celluleTableauProformas commentaire'>" + commentaire + "</td>" + 
        "</tr>");
    }

    if(generationTableauPremiereFois === true)
    {
        $('#example').DataTable(
        {
            "order": [[ 4, "desc" ]],
            "autoWidth": false,
            "columnDefs": [
            { 
                "orderSequence": [ "desc", "asc" ], "targets": [ colonneNbrJoursInaction ],
                "orderSequence": [ "desc", "asc" ], "targets": [ colonneDerniereModification ] 
            }],
            stateSave: false
        });
    }
    else
    {
        $('#example').DataTable(
        {
            "autoWidth": false,
            "columnDefs": [
            {
                "orderSequence": [ "desc", "asc" ], "targets": [ colonneNbrJoursInaction ],
                "orderSequence": [ "desc", "asc" ], "targets": [ colonneDerniereModification ] 
            }],
            stateSave: false
        });
    }
    $("#informationsChargement").hide();
}

// prend en parametre une date sous forme de chaine caracteres "yyyy/mm/dd" et la retourne au format : "yyyy-mm-dd"
function formaterDate(date)
{
    var jour = date.substring(8, 10);
    var annee = date.substring(0, 4);
    var mois = date.substring(5, 7);
    return annee + "-" + mois + "-" + jour;
}

//prend en paramètres le numéro de client ainsi que le numéro de proforma, et récupère les informations nécessaires pour remplir le formulaire et les passes
//a la fonction remplirFormulaire
function informationsContact(numeroClient, numeroProforma)
{
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/proforma/informationsContact.php",
        data:
        {
            numeroClient: numeroClient,
            numeroProforma: numeroProforma
        },
        dataType: 'json',
        type: 'post'
    }).done(function(rep)
    {
        console.log(rep)
        remplirFormulaire(nomClient, numeroProforma, rep);
    }).fail(function(err)
    {
        console.log(err);
    });
}

//prend en parametre : 
// 1 : un booléen, s'il est true on ajoute le suivi proforma si il est false on modifie le suivi de la proforma
// 2, 3 et 4 sont des chaines de caractères qui contiennent respectivement le code société, le numéro du client et le numéro de la proforma
// 5 : chaine de caractères contenant le code utilisateur (pour l'instant c'est une chaine de caractères vide)
// cette fonction récupère les informations du formulaire, et les envoies (avec les paramètres) via une requete ajax au fichier ajouterDetailProforma.php
function ajouterOuModifier(ajouterOuModifier, codeSociete, numeroClient, numeroProforma, codeUtilisateur)
{
    if($("#cloturerProforma").is(":checked"))
    {
        var dateCloture = dateFormatBdd; 
    }
    else
    {
        var dateCloture = "0001-01-01";
    }
    
    if($("#archiverProforma").is(":checked"))
    {
        var dateArchive = dateFormatBdd;
    }
    else
    {
        var dateArchive = "0001-01-01";
    }
    
    if($("#dateProchaineAction").val() == "")
    {
        var dateProchaineAction = "0001-01-01";
    }
    else
    {
        var dateProchaineAction = $("#dateProchaineAction").val();
    }
    
    var dateDerniereModification = dateFormatBdd;
    var anciensCommentaires = $("#listeAnciensCommentaires").val();
    if($("#commentaireProforma").val() === "")
    {
        var commentaire = "";
    }
    else if(anciensCommentaires != "")
    {
        var commentaire = anciensCommentaires + " ( Enreg : " + dateFormatBdd + " ) " + $("#commentaireProforma").val();
    }
    else
    {
        commentaire = " ( Enreg : " + dateFormatBdd + " ) " + $("#commentaireProforma").val();
    }
    var commentaireCloture = $('#pourquoiCloturerProforma').val();
    var commentaireArchive = $('#commentaireArchiverProforma').val();
    
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/proforma/ajouterDetailProforma.php",
        type: "post",
        dataType: "json",
        data:
        {
            codeSociete : codeSociete,
            numeroClient : numeroClient,
            numeroProforma : numeroProforma,
            codeUtilisateur : codeUtilisateur,
            dateDerniereModification : dateDerniereModification,
            dateProchaineAction : dateProchaineAction,
            commentaire : commentaire,
            dateCloture : dateCloture,
            dateArchive : dateArchive,
            commentaireCloture : commentaireCloture,
            commentaireArchive : commentaireArchive,
            ajouterOuModifier : ajouterOuModifier
        }
    }).done(function(rep)
    {
        console.log(rep)
        $("#formulaireSuiviProformas").modal('hide');

        recupererProformas(direction, soustraireDate(dateFormatBdd, parseInt($("#dernieresProformas").val())).toISOString().slice(0,10));
    }).fail(function(xhr)
    {
        alert("Impossible d'ajouter ou de modifier le suivi de cette proforma");
        console.log(xhr);
    })
}

// prend 2 paramètres, des objets de type date, fais la soustraction du premier et du deuxième
// et retourne le nombre de jours de différence
function differenceEntreDates(date1, date2) 
{
    var date1FormatUtc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var date2FormatUtc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((date1FormatUtc - date2FormatUtc) / millisecondesParJour);
}

//prend en parametre la liste des commentaires du suivi d'une proforma, enleve les "( Enreg : )" et retourne un tableau
//contenant le commentaire précédé de sa date de saisie
function afficherCommentaires(commentaires)
{
    var tableauCommentaires = [];
    var nombreIterations = commentaires.match(/\( Enreg :/g);
    if(commentaires != "")
    {
        for(var i = 0; i < nombreIterations.length; i++)
        {
            var date;
            commentaires = commentaires.replace("( Enreg : ", "");
            date = commentaires.slice(0, 10);

            commentaires = commentaires.replace(date + " ) ", "");

            if(commentaires.indexOf("( Enreg :") == -1)
            {
                var commentaireUtilisateur = commentaires;
            }
            else
            {
                var commentaireUtilisateur = commentaires.slice(0, commentaires.indexOf("( Enreg :"));
            }

            commentaires = commentaires.replace(commentaireUtilisateur, "");
            tableauCommentaires.push(date + " : " + commentaireUtilisateur.trim())

        }
    }
    return tableauCommentaires;
}

//prend un objet de type date en paramètre et un nombre de mois, soustrait le nombre de mois a la date et retourne le résultat
function soustraireDate(dateInitiale, mois) 
{
    var date = new Date(dateInitiale);
    date.setMonth(date.getMonth() - mois);
    return date;
}

var nomClient = "";
var numeroProforma = "";
var nombreDeJoursActuel = 0;
var dateDuJour = new Date(); //crée un objet date a partir de la date actuelle
var dateFormatBdd = formatDateValide(dateDuJour); //stocke dans cette variable la date du jour au format : yyyy-mm-dd
var ajouter = true;
var url = window.location.href.split(''); //un tableau contenant chaque caractere de l'url
var millisecondesParJour = 86400000;
var generationTableauPremiereFois = true;
var listeAnciensCommentaires;
//recupere code=T si il y est 
var direction = $(location).prop('search').slice($(location).prop('search').indexOf("&code=T"), $(location).prop('search').indexOf("&code=T") + 7);

if(direction != "&code=T") //si l'utilisateur ne fait pas partie de la direction, on cache la zone qui permet d'archiver une proforma
{
    $("#archiver").hide();
}
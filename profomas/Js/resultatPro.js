$(document).ready(function()
{
    recupererProformas(direction);

    $("#boutonFermeture").on('click', function()
    {
        window.close();
    });

    $("#modificationCommentaire").append(" " + dateFormatBdd);
 
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
                
                if($(this).hasClass("numeroProforma"))
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
            ajouterOuModifierProforma = setInterval(function()
            {
                if($("#informationsChargement").is(":visible"))
                {
                    console.log("nuit")
                    $("#informationsChargement").hide();
                }
                else
                {
                    console.log("jour")
                    $("#informationsChargement").show();
                }
            }, 700);
        }
    });

    $("#nombreDeJours").on('input', function()
    {
        nombreDeJoursSaisis = $(this).val();
        var dateProchaineAction = ajouterNombreJour(dateDuJour, nombreDeJoursSaisis);
        dateProchaineAction = formatDateValide(dateProchaineAction).replace(/\//g, "-")
        $("#dateProchaineAction").val(dateProchaineAction);
    });
});

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
    var dateDuJour = annee + "/" + mois + "/" + jour;
    return dateDuJour;
}

function ajouterNombreJour(date, nbrJours)
{
    nbrJoursMilliSecondes = 86400000 * nbrJours;
    var tempsDate = date.getTime();
    tempsDate += nbrJoursMilliSecondes;
    dateProchaineAction = new Date(tempsDate);
    return dateProchaineAction;
}

function remplirFormulaire(nomClient, numeroProforma, informations)
{
    console.log(informations)
    $("#titreFormulaireSuiviProformas").empty().append("<div id='nomClient'>" + nomClient + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='numeroProforma'>Devis n°" + numeroProforma + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='nomContact'>" + informations.nomContact + "</div>");
    $("#titreFormulaireSuiviProformas").append("<div id='telephoneContact'>" + informations.telephoneContact + "</div>");
    $("#dateDeniereModification").empty().append("Modifié le : " + informations.derniereModification);
    $("#commentaireProforma").val("");
    $("#nombreDeJours").val("");
    $("#dateProchaineAction").val(informations.prochaineAction);
    if(informations.cloture != "0001-01-01" && informations.cloture != "")
    {
        $("#cloturerProforma").prop("checked", true);
        $("#commentaireArchiverProforma").val(informations.commentaireArchive);
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

function recupererProformas(direction)
{
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/proforma.php" + $(location).prop('search'),
        type: "post",
        dataType: "json",
        data:
        {
            direction: direction
        }
    }).done(function(reponse)
    {
        if(generationTableauPremiereFois == true)
        {
            clearInterval(chargementDesProformas);
            console.log(chargementDesProformas)
            if($("#informationsChargement").is(":hidden"))
            {
                $("#informationsChargement").show();
            }
            genererTableau(reponse);
            generationTableauPremiereFois = false;
        }
        else
        {
            clearInterval(ajouterOuModifierProforma);
            $('#example').DataTable().destroy();
            genererTableau(reponse);
        }
    }).fail(function(err)
    {
        $("#informationsChargement").append("Impossible de récupérer les proformas");
        console.log(err)
    });
}

function genererTableau(proformas)
{
    var joursInaction = 0;
    if(direction === "&code=T")
    {
        var enteteArchive = "<th class='tableHeader' id='tdHeader10'>Archivé</th>";
        var nombreDeColonnes = 11;
    }
    else
    {
        enteteArchive = "";
        var nombreDeColonnes = 10;
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
            enteteArchive +
            "<th class='tableHeader' id='tdHeader11'>&nbsp;Clôturé&nbsp;</th>" +
            "<th class='tableHeader' id='tdHeader12'>Nbre Jours d'inaction <div id='cliquezIci'>cliquez-ici</div></th>" +	
            "<th class='tableHeader' id='tdHeader13'>Prochaine action</th>" +
            "<th class='tableHeader' id='tdHeader14'>Date derniere modif </th>" +				
            "<th class='tableHeader' id='tdHeader15'>Commentaire</th>" +
        "</tr>"
    );

    $("#corpsTableauProformas").empty();
    for(var i = 0; i < proformas.length; i++)
    {
        if(proformas[i].archive == "0001-01-01" || proformas[i].archive == false)
        {
            archive = "";
        }
        else
        {
            archive = proformas[i].archive;
        }

        if(proformas[i].cloture == "0001-01-01" || proformas[i].cloture == false)
        {
            cloture = "";
        }
        else
        {
            cloture = proformas[i].cloture;
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

        if(derniereModification == "" && prochaineAction == "")
        {
            var date = proformas[i].dateCreation.date.slice(0, 10);
            date = new Date(date);
            joursInaction = differenceEntreDates(dateDuJour, date);
        }
        else if(derniereModification != "" && prochaineAction == "")
        {
            joursInaction = differenceEntreDates(dateDuJour, stringToDate(derniereModification));
        }
        else if(derniereModification == "" && prochaineAction != "")
        {
            joursInaction = differenceEntreDates(dateDuJour, stringToDate(prochaineAction));
        }
        else
        {
            if(stringToDate(derniereModification) > stringToDate(prochaineAction))
            {
                joursInaction = differenceEntreDates(dateDuJour, stringToDate(derniereModification));
            }
            else
            {
                joursInaction = differenceEntreDates(dateDuJour, stringToDate(prochaineAction));
            }
        }

        if(joursInaction <= 0)
        {
            joursInaction = "";
        }

        if(direction === "&code=T")
        {
            var celluleArchive = "<td class='celluleTableauProformas archiverProforma'>" + archive + "</td>";
        }
        else
        {
            var celluleArchive = "";
        }

        $("#corpsTableauProformas").append(
        "<tr class='bodyRows'>" + 
            "<td class='celluleTableauProformas'>" + proformas[i].numeroRepresentant + "</td>" +
            "<td class='celluleTableauProformas codeSociete'>" + proformas[i].codeSociete + "</td>" +
            "<td class='numeroClient'>" + "<a href='" + proformas[i].lienClient + "' target='_blank' style='color:blue'>" + proformas[i].numeroClient + "</td>" +
            "<td class='celluleTableauProformas raisonSociale'>" + proformas[i].raisonSociale + "</td>" +
            "<td class='celluleTableauProformas'>" + formaterDate(proformas[i].dateCreation.date) + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].type + "</td>" +
            "<td class='numeroProforma'>" +
                "<a href='" + proformas[i].lienPdf + "' target='_blank'><i class='fas fa-file-pdf fa-3x'></i><br>" + proformas[i].numeroProforma + 
            "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].horsTaxes + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].reference + "</td>" +
            celluleArchive +
            "<td class='celluleTableauProformas cloturerProforma'>" + cloture + "</td>" +
            "<td class='celluleTableauProformas joursInaction'>" + joursInaction + "</td>" +
            "<td class='celluleTableauProformas prochaineAction'>" + prochaineAction + "</td>" +
            "<td class='celluleTableauProformas dateCommentaire'>" + derniereModification + "</td>" +
            "<td class='celluleTableauProformas commentaire'>" + commentaire + "</td>" + 
        "</tr>");
    }

    $('#example').DataTable(
    {
        "order": [[ 5, "desc" ]],
        "autoWidth": false,
        "columnDefs": [
            { "orderSequence": [ "desc", "asc" ], "targets": [ nombreDeColonnes ] }
        ]
    });
    $("#informationsChargement").hide();
}

function formaterDate(date)
{
    var jour = date.substring(8, 10);
    var annee = date.substring(0, 4);
    var mois = date.substring(5, 7);
    return jour + "/" + mois + "/" + annee;
}

function stringToDate(date)
{
    var jour = date.substring(0, 2);
    var mois = date.substring(3, 5);
    var annee = date.substring(6, 10);
    return new Date(annee, mois - 1, jour);
}

function informationsContact(numeroClient, numeroProforma)
{
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/informationsContact.php",
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
        url: $(location).prop("origin") + "/Projet20/api/ajouterDetailProforma.php",
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

        recupererProformas(direction);
    }).fail(function(xhr)
    {
        alert(xhr.status)
        alert(xhr.responseText)
        //console.log(err)
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

var nomClient = "";
var numeroProforma = "";
var nombreDeJoursActuel = 0;
var dateDuJour = new Date();
var dateFormatBdd = formatDateValide(dateDuJour).replace(/\//g, "-"); //stocke dans cette variable la date du jour au format : yyyy-mm-dd
var ajouter = true;
var url = window.location.href.split('');
var millisecondesParJour = 86400000;
var generationTableauPremiereFois = true;
var listeAnciensCommentaires;
var ajouterOuModifierProforma;
var direction = $(location).prop('search').slice($(location).prop('search').indexOf("&code=T"), $(location).prop('search').indexOf("&code=T") + 7);
console.log($("#informationsChargement").text())
var chargementDesProformas = setInterval(function()
{
    if($("#informationsChargement").is(":visible"))
    {
        console.log("nuit")
        $("#informationsChargement").hide();
    }
    else
    {
        console.log("jour")
        $("#informationsChargement").show();
    }
}, 700);

console.log(chargementDesProformas)
if(direction != "&code=T")
{
    $("#archiver").css('display', 'none');
}


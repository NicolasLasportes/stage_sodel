$(document).ready(function()
{
    recupererProformas(false);

    $("#boutonFermeture").on('click', function()
    {
        windows.close();
    });

    $("#modificationCommentaire").append(" " + dateFormatBdd);
 
    $("#example").delegate('.celluleTableauProformas', 'click', function()
    {
        $('#formulaireSuiviProformas').modal('show');
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
                $("#numeroPiece").val($(this).text());
                informationsContact("77O3yi9p5MMO4l5m9LOOOgwoFf0", $(this).text());
            }

            if($(this).hasClass("numeroClient"))
            {
                $("#numeroClient").val($(this).text());
            }

            if($(this).hasClass("archiverProforma") || $(this).hasClass("cloturerProforma") || $(this).hasClass("prochaineAction") || $(this).hasClass("dateCommentaire") || $(this).hasClass("commentaire")) 
            {
                if($(this).text() != "")
                {
                    ajouter = false;
                }
            }

            if($(this).hasClass("numeroProforma"))
            {
                numeroProforma = $(this).text();
            }
            
            if(nomClient != "" && numeroProforma != "")
            {
                remplirEnteteFormulaire(nomClient, numeroProforma);
            }
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
            ajouterOuModifier(ajouter, codeSociete, numeroClient, numeroProforma, "")
        }
    });

    $("#nombreDeJours").on('input', function()
    {
        nombreDeJoursSaisis = $(this).val();
        var dateProchaineAction = ajouterNombreJour(dateDuJour, nombreDeJoursSaisis);
        dateProchaineAction = formatDateValide(dateProchaineAction).replace(/\//g, "-")
        $("#dateProchaineAction").val(dateProchaineAction);
    });

    $("#afficherProformasArchives").on('click', function()
    {
        recupererProformas(true);
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

function remplirEnteteFormulaire(nomClient, numeroProforma)
{
    $("#titreFormulaireSuiviProformas").empty().append("<div id='nomClient'>" + nomClient + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='numeroProforma'>Devis n°" + numeroProforma + "</div>");
    $("#titreFormulaireSuiviProformas").css("font-size", "16px");
}

function recupererInformationsCommercial(url)
{
    var informationsCommercial = [];
    for(var i = url.length - 1; i > 0 ; i--) 
    {
        if(url[i] != "?")
        {
            informationsCommercial.push(url[i]);
        }
        else
        {
            break;
        }
    }
    return informationsCommercial.reverse().join('');
}

function recupererProformas(archive)
{
    //console.log(archive)
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/proforma.php" + $(location).prop('search'),
        type: "post",
        dataType: "json",
        data:
        {
            archive: archive
        }
    }).done(function(reponse)
    {
        //console.log(reponse);
        if(generationTableauPremiereFois == true)
        {
            genererTableau(reponse);
            $('#example').DataTable(
            {
                "order": [[ 1, "desc" ]]
            });
            
            generationTableauPremiereFois = false;
        }
        else
        {
            $('#example').DataTable().destroy();
            genererTableau(reponse);
            $('#example').DataTable();
        }
    }).fail(function(err)
    {
        //console.log(err);
    });
}

function genererTableau(proformas)
{
    //console.log(proformas)
    var joursInaction = 0;
    //console.log(dateDuJour)
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
            "<th class='tableHeader' id='tdHeader10'>Archivé</th>" +
            "<th class='tableHeader' id='tdHeader11'>Clôturé</th>" +
            "<th class='tableHeader' id='tdHeader12'>Nbre Jours d'inaction</th>" +	
            "<th class='tableHeader' id='tdHeader13'>Prochaine action</th>" +
            "<th class='tableHeader' id='tdHeader14'>Date derniere modif </th>" +				
            "<th class='tableHeader' id='tdHeader15'>Commentaire</th>" +
        "</tr>"
    );
    $("#corpsTableauProformas").empty();
    for(var i = 0; i < proformas.length; i++)
    {
        //console.log(proformas[i].archive);
        if(proformas[i].archive == "0001-01-01"|| proformas[i].archive == false)
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

        if(proformas[i].prochaineAction == false)
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
            commentaire = proformas[i].commentaire;
        }        

        if(derniereModification == "" && prochaineAction == "")
        {
            joursInaction = differenceEntreDates(dateDuJour, new Date(proformas[i].dateCreation.date));
        }
        else if(derniereModification != "" && prochaineAction == "")
        {
            joursInaction = differenceEntreDates(dateDuJour, Date.parse(stringToDate(derniereModification)));
        }
        else if(derniereModification == "" && prochaineAction != "")
        {
            joursInaction = differenceEntreDates(dateDuJour, Date.parse(stringToDate(prochaineAction)));
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
                "<a href='" + proformas[i].lienPdf + "' target='_blank'><img class='imgPdf' src='images/iconepdf.png'>" + proformas[i].numeroProforma 
            + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].horsTaxes + "</td>" +
            "<td class='celluleTableauProformas'>" + proformas[i].reference + "</td>" +
            "<td class='celluleTableauProformas archiverProforma'>" + archive + "</td>" +
            "<td class='celluleTableauProformas cloturerProforma'>" + cloture + "</td>" +
            "<td class='celluleTableauProformas joursInaction'>" + joursInaction + "</td>" +
            "<td class='celluleTableauProformas prochaineAction'>" + prochaineAction + "</td>" +
            "<td class='celluleTableauProformas dateCommentaire'>" + derniereModification + "</td>" +
            "<td class='celluleTableauProformas commentaire'>" + commentaire + "</td>" + 
        "</tr>");
    }
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
    var annee = date.substring(3, 5);
    var mois = date.substring(6, 10);
    console.log(new Date(annee, mois, jour))
    return new Date(annee, mois, jour);
}

function informationsContact(dossier, numeroProforma)
{
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/informationsContact.php",
        data:
        {
            dossier: dossier,
            numeroProforma: numeroProforma
        },
        dataType: 'json',
        type: 'post'
    }).done(function(rep)
    {
        //console.log(rep)
    }).fail(function(err)
    {
        //console.log(err);
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
    var commentaire = $("#commentaireProforma").val();
    var commentaireCloture = $('#pourquoiCloturerProforma').val();
    var commentaireArchive = $('#commentaireArchiverProforma').val();
    
    console.log(dateCloture);
    console.log(dateArchive);
    console.log(dateDerniereModification);
    console.log(dateProchaineAction);
    console.log(commentaire);
    console.log(commentaireCloture);
    console.log(commentaireArchive);
    console.log(ajouterOuModifier);
    console.log(codeSociete);
    console.log(numeroClient);
    console.log(numeroProforma);
    
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
        recupererProformas(false);
    }).fail(function(err)
    {
        console.log(err)
    })
}

// prend 2 paramètres, des objets de type date, fais la soustraction du premier et du deuxième
//et retourne le nombre de jours de différence
function differenceEntreDates(date1, date2) 
{
    var date1FormatUtc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var date2FormatUtc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((date1FormatUtc - date2FormatUtc) / millisecondesParJour);
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
// console.log($(location).prop("origin") + "/Projet20/api/proforma.php" + $(location).prop('search'))
// console.log($(location).prop('protocol'));
// console.log($(location).prop('origin'));
// console.log($(location).prop("hostname"));


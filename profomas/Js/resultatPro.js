$(document).ready(function()
{
    $("#modificationCommentaire").append(" " + dateDuJour.toLocaleDateString());
 
    $("tr").delegate('.celluleTableauProformas', 'click', function()
    {
        $('#formulaireSuiviProformas').modal('show');
        $(this).parent().find('td').each(function()
        {
            if($(this).hasClass("raisonSociale"))
            {
                nomClient = $(this).text();
               
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
        else if($("#nombreDeJours").val() <= 0 && $("#dateProchaineAction").val() == "")
        {
            alert("Veuillez rentrer ou un nombre de jours ou la date de la prochaine action");
            return false;
        }
        else if($("#pourquoiCloturerProforma").val().length > 100)
        {
            alert("Le commentaire de clôture ne peut comporter que 100 caractères maximum");
            return false;
        }
        else if($("#commentaireArchive").val().length > 100)
        {
            alert("Le commentaire d'archive ne peut comporter que 100 caractères maximum");
            return false;
        }
        else if($("#commentaireArchive").val() != "" && $("#archive").prop("checked") === false)
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
            alert("Form submitted")
            $("#detailProforma").submit(function()
            {
                alert("form submitted")
            });
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

function remplirEnteteFormulaire(nomClient, numeroProforma)
{
    $("#titreFormulaireSuiviProformas").empty().append("<div id='nomClient'>" + nomClient + "</div><br>");
    $("#titreFormulaireSuiviProformas").append("<div id='numeroProforma'>Devis n°" + numeroProforma + "</div>");
    $("#titreFormulaireSuiviProformas").css("font-size", "16px");
}

var nomClient = "";
var numeroProforma = "";
var nombreDeJoursActuel = 0;
var dateDuJour = new Date();
$(document).ready(function()
{
    $("#example").delegate('.raisonSociale', 'click', function()
    {
        $("#detailOrdre").modal('show');
        $.when(
            $(this).parents("tr").find('td').each(function()
            {
                if($(this).hasClass("codeSociete"))
                {
                    codeSociete = $(this).text();
                }
                if($(this).hasClass("numeroOrdre"))
                {
                    numeroOrdre = $(this).text();
                }
                if($(this).hasClass("numeroClient"))
                {
                    numeroClient = $(this).text();
                }
            })
        ).then(function()
        {
            recupererDetailOrdre(numeroClient, numeroOrdre, codeSociete);
        });
    });

    $('#detailOrdre').on('hidden.bs.modal', function () {
        $("#entete").empty();
        $("#tableauDetailOrdre tbody").empty();
        $("#total").empty();
    })
});

function recupererDetailOrdre(numeroClient, numeroOrdre, codeSociete)
{
    $.ajax({
        url: $(location).prop("origin") + "/Projet20/api/afficherDetailOrdre.php",
        type: "post",
        dataType: 'json',
        data:
        {
            numeroClient: numeroClient,
            numeroOrdre: numeroOrdre,
            codeSociete: codeSociete
        }
    }).done(function(rep)
    {
        console.log(rep)
        afficherDetailOrdre(rep)
    }).fail(function(err)
    {
        console.log(err)
    });
}

function afficherDetailOrdre(detailOrdre)
{
    $("#entete").append("Détail de l'ordre n°" + numeroOrdre);
    var total = 0;
    for(var i = 0; i < detailOrdre.length; i++)
    {
        var totalLigne = detailOrdre[i].prixUnitaire * detailOrdre[i].quantiteProduit;
        $("#tableauDetailOrdre tbody").append(
            "<tr>" +
                "<td class='referenceProduit detailOrdre'>" + detailOrdre[i].referenceProduit + "</td>" + 
                "<td class='quantiteProduit detailOrdre'>" + parseInt(detailOrdre[i].quantiteProduit) + "</td>" +
                "<td class='prixUnitaire detailOrdre'>" + detailOrdre[i].prixUnitaire + "</td>" +
                "<td class='totalLigne detailOrdre'>" + totalLigne.toFixed(2) + "</td>" +
            "</tr>"
        );
        total += detailOrdre[i].prixUnitaire * detailOrdre[i].quantiteProduit;
    }
    $("#total").append("Total marchandises H.T : " + total.toFixed(2));
}

var codeSociete;
var numeroOrdre;
var numeroClient;
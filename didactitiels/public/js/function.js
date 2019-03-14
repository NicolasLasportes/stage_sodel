$(document).ready(function()
{
    var didactitielOuSchema = window.location.href.slice(window.location.href.lastIndexOf("/") + 1, window.location.href.length);
    if(didactitielOuSchema === "didactitiel")
    {
        $("title").append("Didactitiel");
        page = "didactitiels";
        $("#titreDeLaPage").append("Didactitiel");
        $("body").append(
        "<table class='table' id='tableauDidactitiels'>" + 
            "<thead>" + 
                "<tr>" +
                    "<th class='invisible'>Id</th>" +
                    "<th>Intitulé</th>" +
                    "<th>Pdf</th>" +
                    "<th>Excel</th>" +
                    "<th>Excel2</th>" +
                    "<th>Numéro devis</th>" +
                    "<th>Commentaire</th>" +
                    "<th>Supprimer</th>" +
                    "<th>Modifier</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
        "</table>"
        );
        
        $("#type").val("D");
        $("label[for=excelOuSchema]").append("Excel");
        $("label[for=excelOuSchema2]").append("Excel 2");
    }
    else if(didactitielOuSchema === "schema")
    {
        $("title").append("Schémas")
        page = "schemas";
        $("#titreDeLaPage").append("Schémas");
        $("body").append(
        "<table class='table dataTables' id='tableauSchemas'>" + 
            "<thead>" + 
                "<tr>" +
                    "<th class='invisible'>Id</th>" +
                    "<th>Intitulé</th>" +
                    "<th>Pdf</th>" +
                    "<th>Schéma</th>" +
                    "<th>Schéma2</th>" +
                    "<th>Numéro devis</th>" +
                    "<th>Commentaire</th>" +
                    "<th>Supprimer</th>" +
                    "<th>Modifier</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
        "</table>"
        );
            
        $("#type").val("S");
        $("label[for=excelOuSchema]").append("Schéma");
        $("label[for=excelOuSchema2]").append("Schéma 2");
    }

    $("#enregistrer").on('click', function(e)
    {
        e.preventDefault();
        verificationValeursSaisies();
    })

    $(".modifier").on('click', function()
    {
        console.log("modifier")
    });

    $(".supprimer").on('click', function()
    {
        console.log("tu as cliqué sur la corbeille")
        $(this).parents('tr').find("td").each(function()
        {
            console.log($(this))
        });
    });
    recupererSchemaOuDidactitels(page)
});

var page = "";

function recupererSchemaOuDidactitels(type)
{

    var url = "api/didactitiels";

    $.ajax({
        url: url,
        dataType: 'json',
        type: "post",
        data: {
            type: type
        },
        headers: { 
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }).done(function(rep)
    {
        console.log(rep)
        genererTableau(rep, type)
    }).fail(function(err)
    {
        console.log(err)
    });
} 

function genererTableau(didactitielsOuSchemas, type)
{
    if(type == "didactitiels")
    {
        var idTableau = "#tableauDidactitiels";
    }
    else
    {
        var idTableau = "#tableauSchemas";
    }
    $(idTableau + " > tbody").empty();
    for(var i = 0; i < didactitielsOuSchemas.length; i++)
    {
        //on échappe les caractères spéciaux du nom du fichier pdf
        if(didactitielsOuSchemas[i].pdf.indexOf("\'") != -1)
        {
            var pdf = didactitielsOuSchemas[i].pdf.replace(/\'/g, "&#39;");
        }
        else
        {
            var pdf = didactitielsOuSchemas[i].pdf;
        }

        if(pdf.indexOf("\"") != -1)
        {
            pdf = pdf.replace(/\"/g, "&quot;");
        }
        
        //on échappe les caractères spéciaux du nom du fichier ressource 1
        if(didactitielsOuSchemas[i].fichier.indexOf("\'") != -1)
        {
            var fichier = didactitielsOuSchemas[i].fichier.replace(/\'/g, "&#39;");
        }
        else
        {
            var fichier = didactitielsOuSchemas[i].fichier;
        }

        if(fichier.indexOf("\"") != -1)
        {
            fichier = fichier.replace(/\"/g, "&quot;");
        }

        //on échappe les caractères spéciaux du nom du fichier ressource 2
        if(didactitielsOuSchemas[i].fichier2.indexOf("\'") != -1)
        {
            var fichier2 = didactitielsOuSchemas[i].fichier2.replace(/\'/g, "&#39;");
        }
        else
        {
            var fichier2 = didactitielsOuSchemas[i].fichier2;
        }

        if(didactitielsOuSchemas[i].fichier2.indexOf("\"") != -1)
        {
            fichier2 = fichier2.replace(/\"/g, "&quot;");
        }
        
        if(didactitielsOuSchemas[i].numeroPdf == 0)
        {
            var numeroPdf = "";
        }
        else
        {
            var numeroPdf = didactitielsOuSchemas[i].numeroPdf;
        }
        $(idTableau + " > tbody").append(
            "<tr>" +
                "<td class='id invisible'>" + didactitielsOuSchemas[i].id + "</td>" +
                "<td class='intitule'>" + didactitielsOuSchemas[i].intitule + "</td>" +
                "<td class='pdf'><a href='files/" + pdf + "' download>" + pdf + "</a></td>" +
                "<td class='fichier'><a href='files/" + didactitielsOuSchemas[i].fichier + "' download>" + didactitielsOuSchemas[i].fichier + "</a></td>" +
                "<td class='fichier2'><a href='files/" + didactitielsOuSchemas[i].fichier2  + "' download>" + didactitielsOuSchemas[i].fichier2 + "</a></td>" +
                "<td class='numeroPdf'>" + numeroPdf + "</td>" +
                "<td class='commentaire'>" + didactitielsOuSchemas[i].commentaire + "</td>" +
                "<td class='supprimer'><i class='fas fa-trash-alt fa-2x'></i></td>" +
                "<td class='modifier'><i class='fas fa-pen fa-2x'></i></td>" +
            "</tr>"
        );
    }
    $(idTableau).DataTable({
        "language": {
            "url": "node_modules/datatable/langues/French.json"
        }
    });
}

function verificationValeursSaisies()
{
    if($("#intitule").val().length > 180)
    {
        alert("L'intitulé ne peut pas dépasser 180 caractères");
    }
    else if($("#commentaire").val().length > 200)
    {
        alert("Le commentaire ne peut pas dépasser 200 caractères");
    }
    else
    {
        $("#formulaireAjoutOuModification").submit();
    }
}

function supprimer()
{
    $(this).parents('tr').find(td).each(function()
    {
        console.log($(this))
    });
}

// function ajouter(type)
// {
//     console.log(type)
//     var donneesFormulaire = new FormData();
//     donneesFormulaire.append('pdf', $('input[type=file]')[0].files[0]);
//     console.log($('input[type=file]')[0].files[0])
//     donneesFormulaire.append("fichier", $('#pdf').prop("files"));
//     console.log(donneesFormulaire)
//     $.ajax({
//         url: "api/ajouter",
//         type: "post",
//         data: {
//             donnees: donneesFormulaire,
//             type: type
//         },
//         headers: { 
//             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//         },
//         dataType: 'json',
//         processData: false,
//         contentType: false
//     }).done(function(rep)
//     {
//         console.log(rep)
//     }).fail(function(err)
//     {
//         console.log(err)
//     });
// }
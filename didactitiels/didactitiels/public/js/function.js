$(document).ready(function()
{
    var didactitielOuSchema = window.location.href.slice(window.location.href.indexOf("&type="), window.location.href.indexOf("&type=") + 7);
    console.log(didactitielOuSchema);
    if(didactitielOuSchema === "&type=d")
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
                    "<th>Commentaire</th>" +
                    "<th>Options</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
        "</table>"
        );
        
        $("#type").val("D");
        $("label[for=excelOuSchema]").append("Excel");
        $("label[for=excelOuSchema2]").append("Excel 2");
    }
    else if(didactitielOuSchema === "&type=s")
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
                    "<th>Commentaire</th>" +
                    "<th>Options</th>" +
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
        console.log("j'ai cliqu")
        e.preventDefault();
        verificationValeursSaisies();
    })
    recupererSchemaOuDidactitels(page)
});

var page = "";

function recupererSchemaOuDidactitels(type)
{
    if(type === "didactitiels")
    {
        var url = "api/didactitiels";
    }
    else
    {
        var url = "api/schemas";
    }

    $.ajax({
        url: url,
        dataType: 'json',
        type: "get",
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

        $(idTableau + " > tbody").append(
            "<tr>" +
                "<td class='id invisible'>" + didactitielsOuSchemas[i].id + "</td>" +
                "<td class='intitule'>" + didactitielsOuSchemas[i].intitule + "</td>" +
                "<td class='pdf'><a href='files/" + pdf + "' download>" + pdf + "</a></td>" +
                "<td class='fichier'><a href='files/" + didactitielsOuSchemas[i].fichier + "' download>" + didactitielsOuSchemas[i].fichier + "</a></td>" +
                "<td class='fichier2'><a href='files/" + didactitielsOuSchemas[i].fichier2  + "' download>" + didactitielsOuSchemas[i].fichier2 + "</a></td>" +
                "<td class='commentaire'>" + didactitielsOuSchemas[i].commentaire + "</td>" +
                "<td><i class='fas fa-trash-alt fa-2x'></i><i class='fas fa-pen fa-2x'></i></td>" +
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
    console.log("vérifie que c'est bien saisie")
    console.log($("#pdf").prop('files'))
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
        console.log("submit")
        $("#formulaireDidactitielOuSchema").submit();
    }
    //ajouter(page)
}

// function ajouter(type)
// {
//     var donneesDuFormulaire = new FormData($(this)[0]);
//     console.log(donneesDuFormulaire)
//     $.ajax({
//         url: "api/ajouter/didactitiel",
//         type: "post",
//         data: {
//             donnees: donneesDuFormulaire,
//             fichier: $("#pdf").prop('files')
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
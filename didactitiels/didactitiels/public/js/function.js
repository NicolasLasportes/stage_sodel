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
            
        $("label[for=excelOuSchema]").append("Schéma");
        $("label[for=excelOuSchema2]").append("Schéma 2");
    }

    $("#enregistrer").on('click', function()
    {
        verificationValeursSaisies();
    });
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
        console.log(didactitielsOuSchemas[i].pdf.indexOf("\'"))
        if(didactitielsOuSchemas[i].pdf.indexOf("\'") != -1)
        {
            didactitielsOuSchemas[i].pdf = didactitielsOuSchemas[i].pdf.replace(/\'/g, "&quot;");
        }
        $(idTableau + " > tbody").append(
            "<tr>" +
                "<td class='id invisible'>" + didactitielsOuSchemas[i].id + "</td>" +
                "<td class='intitule'>" + didactitielsOuSchemas[i].intitule + "</td>" +
                "<td class='pdf'><a href='files/" + didactitielsOuSchemas[i].pdf + "' download>" + didactitielsOuSchemas[i].pdf + "</a></td>" +
                "<td class='fichier'><a href='files/" + didactitielsOuSchemas[i].fichier + "' download>" + didactitielsOuSchemas[i].fichier + "</a></td>" +
                "<td class='fichier2'><a href='files/" + didactitielsOuSchemas[i].fichier2  + "' download>" + didactitielsOuSchemas[i].fichier2 + "</a></td>" +
                "<td class='commentaire'>" + didactitielsOuSchemas[i].commentaire + "</td>" +
                "<td><i class='fas fa-trash-alt'></i><i class='fas fa-pen'></i></td>" +
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
    var formData = new FormData();
    formData.append('section', 'general');
    formData.append('action', 'previewImg');
    formData.append('image', $('#pdf')[0].files[0]); 

    console.log($("#pdf").prop('files'))
    console.log(formData)
    ajouter(page, formData)
}

function ajouter(type, formData)
{
    console.log(formData)
    console.log($("#pdf").prop('files'))
    $.ajax({
        url: "api/ajouter/didactitiel",
        type: "get",
        processData: false,
        contentType: false,
        data: {
            formData: formData,
            fichier: $("#pdf").prop('files')
        },
        headers: { 
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'json'
    }).done(function(rep)
    {
        console.log(rep)
    }).fail(function(err)
    {
        console.log(err)
    });
}
$(document).ready(function()
{
    var didactitielOuSchema = window.location.href.slice(window.location.href.indexOf("&type="), window.location.href.indexOf("&type=") + 7);
    console.log(didactitielOuSchema);
    if(didactitielOuSchema === "&type=d")
    {
        page = "didactitiels";
        $("#titreDeLaPage").append("Didactitiels");
        $("body").append(
        "<table class='table dataTables' id='tableau'>" + 
            "<thead>" + 
                "<tr>" +
                    "<th>Intitulé</th>" +
                    "<th>Pdf</th>" +
                    "<th>Excel</th>" +
                    "<th>Excel2</th>" +
                    "<th>Commentaire</th>" +
                    "<th>Options</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody>" +
                "<td>Bonjour</td>" +
                "<td>pdf</td>" +
                "<td>tableau excel</td>" +
                "<td>facultatif</td>" +
                "<td>un incroyable commentaire</td>" + 
                "<td>supprimer / modifier</td>" +
            "<tbody>" +
        "</table>"
        );

        $("label[for=excelOuSchema]").append("Excel");
        $("label[for=excelOuSchema2]").append("Excel 2");
    }
    else if(didactitielOuSchema === "&type=s")
    {
        page = "schemas";
        $("#titreDeLaPage").append("Schémas");
        $("body").append(
            "<table class='table dataTables' id='tableau'>" + 
                "<thead>" + 
                    "<tr>" +
                        "<th>Intitulé</th>" +
                        "<th>Pdf</th>" +
                        "<th>Schéma</th>" +
                        "<th>Schéma2</th>" +
                        "<th>Commentaire</th>" +
                        "<th>Options</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>" +
                    "<td>Bonjour</td>" +
                    "<td>pdf</td>" +
                    "<td>un schéma</td>" +
                    "<td>un schéma</td>" +
                    "<td>un incroyable commentaire</td>" + 
                    "<td>supprimer / modifier</td>" +
                "<tbody>" +
            "</table>"
        );

        $("label[for=excelOuSchema]").append("Schéma");
        $("label[for=excelOuSchema2]").append("Schéma 2");
    }
});

var page = "";
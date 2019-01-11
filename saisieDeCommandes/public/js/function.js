function obtenirCommandeClient(id)
{
    console.log("je mexecute")
    $.ajax({
        url : '/commandeClient/' + id,
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
    }).done(function(commandes)
    {
        console.log(commandes);
        genererTableauCommande(commandes);
        $('#tableauCommande').DataTable();
    });
}

function genererTableauCommande(commandes)
{
    var cloturer; 
    var type;
    for(var i = 0; i < commandes.length; i++)
    {
        if(commandes[i].cloturer_commande == 0)
        {
            cloturer = "";
        }
        else
        {
            cloturer = "C";
        }

        if(commandes[i].type_commande == 0)
        {
            type = "Devis";
        }
        else
        {
            type = "Commande";
        }
        $("#corpsTableauCommande").append(
            "<tr>" + 
                "<td>" + commandes[i].numero_commande + "</td>" + 
                "<td>" + commandes[i].nom_commande + "</td>" + 
                "<td>" + type + "</td>" + 
                "<td>" + commandes[i].date_commande + "</td>" + 
                "<td>" + cloturer + "</td>" + 
                "<td><button class='modifier' id='modifier" + commandes[i].id_commande + "'><img src='images/crayon.png' alt='modifier'></button>" + 
                "<button class='supprimer' id='supprimer" + commandes[i].id_commande + "'><img src='images/corbeille.png' alt='supprimer'></button></td>"  +  
            "</tr>"
        );
    }
}


if(window.location.href.search("client") != -1)
{
    obtenirCommandeClient(id_client);
}

else if(window.location.href.search("commande") != -1)
{
    obtenirDetailCommande('500000013','77O3yi9p5MMO4l5m9LOOOgwoFf0');
    obtenirProduits('77O3yi9p5MMO4l5m9LOOOgwoFf0');
}


$("table").delegate('.afficherCetteCommande', 'click', function()
{
    numero_commande = $(this).attr('id');
    window.location.replace('../commande/' + numero_commande + '&77O3yi9p5MMO4l5m9LOOOgwoFf0');
});

$(".modal").on('click', '#validerLigne', function()
{
    ajouterLigne();
});

$("table").delegate('.supprimer', 'click', function()
{
    if(confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) 
    {
        $('#tableauDetailCommande').DataTable().row( $(this).parents('tr') ).remove().draw();
        var code_produit = $(this).attr('id').split('supprimer').join('');
        supprimerLigneCommande(code_produit);
    } 
});

$("table").delegate('.modifier', 'click', function()
{
    var td_values = [];
    $(this).parents('tr').find('td').each(function()
    {
        if(!$(this).hasClass("ligneTableauCommandes"))
        {
            td_values.push($(this).html());
        }
    });
    code_societe = td_values[0];
    formulaireModification(td_values);
});

$(".modal").on('click', '#validerModificationLigne', function()
{
    modifierLigneCommande(code_societe);
});

$(".col-md-2").on('click', '#cloturerCommande', function()
{
    if(confirm("Êtes-vous sûr de vouloir clôturer cette commande ? (Vous ne pourrez ni la supprimer ni la modifier)")) 
    {
        cloturerCommande(recupererNumCommande(id_inverse));    
    }
});

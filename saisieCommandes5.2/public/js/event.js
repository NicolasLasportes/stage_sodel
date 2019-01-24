if(window.location.href.search("client") != -1)
{
    obtenirCommandeClient(id_client);
}

else if(window.location.href.search("commande") != -1)
{
    obtenirDetailCommande(recupererNumCommande(id_inverse),recupererDossierClient(id_inverse));
    obtenirProduits(recupererDossierClient(id_inverse));
    $("#afficherFormAjoutProduit").hide();
    $("#cloturerCommande").hide();
    $("#titre_commande").append("Commande n°" + recupererNumCommande(id_inverse));
}

$("#ligneOptions").on('click', '#ajouterCommande', function()
{
    detailClient(recupererDossierClient(id_inverse));
});

$(".modal-body").on('click', '#validerCommande', function()
{
    ajouterCommande();
});

$("table").delegate('.ligneTableauCommandes', 'click', function()
{
    var numero_commande = 0;
    $(this).parents('tr').find('td').each(function(){
        if($(this).find("div").hasClass("numero_commande"))
        {
            numero_commande = $(this).children().attr('id');
        }
    });
    window.location.replace('../commande/' + numero_commande + '&' + recupererDossierClient(id_inverse));
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

$("table").delegate('.ligneDetailCommande', 'click', function()
{    
    $("#formulaireModifierLigneCommande").modal('show');
    var valeur_ligne = [];
    $(this).parents('tr').find('td').each(function()
    {
        if(!$(this).hasClass("ligneTableauCommandes"))
        {
            valeur_ligne.push($(this).html());
        }
    });

    formulaireModification(valeur_ligne);

    $(".modal").on('click', "#validerModificationLigne", function()
    {
        modifierLigneCommande(valeur_ligne[0]);
    });
});

$(".col-md-2").on('click', '#cloturerCommande', function()
{
    if(confirm("Êtes-vous sûr de vouloir clôturer cette commande ? (Vous ne pourrez ni la supprimer ni la modifier)")) 
    {
        cloturerCommande(recupererNumCommande(id_inverse));    
    }
});
 
$("#tableauCommande").on('click', '.supprimerCommande', function()
{
    var numero_commande;
    $(this).parents('tr').find('td').each(function()
    {
        if($(this).children('div').hasClass('numero_commande'))
        {
            numero_commande = $(this).children('div').html();
        }
    });
    supprimerCommande(numero_commande, recupererDossierClient(id_inverse));
});

$("#tableauCommande").on('click', '.modifier', function()
{
    var numero_commande = $(this).attr('id').replace('modifier', '');
    afficherDetailCommande(numero_commande, recupererDossierClient(id_inverse));
});

$(".modal").on('click', '#validerModificationCommande', function()
{
    modifierCommande($("#numero_commande").html());
});

$(".formBtn").on('click', '#cloturerModificationCommande', function()
{
    cloturerCommande($("#numero_commande").html());
});

$(".modal").on('shown.bs.modal', function()
{
    $("#referenceProduit").focus();
});
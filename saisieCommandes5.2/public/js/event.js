if(window.location.href.search("clients") != -1)
{
    page_courante = "panierRepresentant";
    recupererCleCommercial(id_inverse);
    if(direction == true)
    {
        $("#titre_client").empty().append(nom_commercial);
        $("title").append(" : " + nom_commercial);
    }
    else
    {
        $("#titre_client").empty().append("Commandes secteur : " + nom_commercial);
        $("title").append(" : " + nom_commercial);
    }
    obtenirListeCommandes(cle_commercial);
}

else if(window.location.href.search("client") != -1)
{
    page_courante = "Liste Commandes";
    obtenirCommandeClient(id_client);
}

else if(window.location.href.search("commande") != -1)
{
    page_courante = "Commande";
    if(window.location.href.search("#consulter") != -1)
    {
        page_courante = "consulterCommande";
    }
    obtenirDetailCommande(recupererNumCommande(id_inverse),recupererDossierClient(id_inverse));
    obtenirProduits(recupererDossierClient(id_inverse));
    $("#afficherFormAjoutProduit").hide();
    $("#cloturerCommande").hide();

    if(window.location.href.search("#ajouterProduit") != -1)
    {
        $("#formulaireAjouterLigneCommande").modal('show');
    }
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
    var dossier = "";
    var affichageTableau = "";
    $(this).parents('tr').find('td').each(function(){
        if($(this).hasClass("numero_commande"))
        {
            numero_commande = $(this).attr('id');
            dossier = $(this).data("dossier");
        }
    });
    if(page_courante == "panierRepresentant")
    {
        affichageTableau = "#consulter";
    }
    window.location.replace('../commande/' + numero_commande + '&' + dossier + affichageTableau);
});

$(".modal").on('click', '#validerLigne', function()
{
    afficher_dernier_produit = true;
    reference_dernier_produit = $("#referenceProduit").val();
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

$(".boutonsDetailCommande").on('click', '#cloturerCommande', function()
{
    if(confirm("Êtes-vous sûr de vouloir clôturer cette commande ? (Vous ne pourrez ni la supprimer ni la modifier)")) 
    {
        cloturerCommande(recupererNumCommande(id_inverse));    
    }
    else
    {
        return false;
    }
});
 
$("#tableauCommande").on('click', '.supprimerCommande', function()
{
    var numero_commande;
    $(this).parents('tr').find('td').each(function()
    {
        if($(this).hasClass('numero_commande'))
        {
            numero_commande = $(this).html();
        }
    });
    if(confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) 
    {
        supprimerCommande(numero_commande, recupererDossierClient(id_inverse));
    } 
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
    if(confirm("Êtes-vous sûr de vouloir clôturer cette commande ? (Vous ne pourrez ni la supprimer ni la modifier)")) 
    {
        cloturerCommande($("#numero_commande").html());
    }  
});

$(".modal").on('shown.bs.modal', function()
{
    $("#referenceProduit").focus();
});

$("#entetePageCommande").on('click', '#fermerPage', function()
{
    window.close();
});


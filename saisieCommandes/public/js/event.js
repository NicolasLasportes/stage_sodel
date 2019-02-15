//Si "clients" est trouvé dans l'url, on génère la page "mon panier" d'un représentant
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

//Sinon si "client" est trouvé dans l'url on génère la page commandes d'un client
else if(window.location.href.search("client") != -1)
{
    page_courante = "Liste Commandes";
    obtenirCommandeClient(id_client);
}

//Sinon si "commande" est trouvé dans l'url on génère la page détail d'une commande
else if(window.location.href.search("commande") != -1)
{
    $(".chargementProduits").append("Chargement du tarif");
    faireClignoter(".chargementProduits");
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
        formulaire_actif = "ajouter";
    }
}

$("#ajouterCommande").on('click', function() //quand on clique sur le bouton ajouter une commande on lance la fonction detailClient()
{
    detailClient(recupererDossierClient(id_inverse));
});

$(".modal-body").on('click', '#validerCommande', function() //quand on clique sur le bouton valider dans le formulaire d'ajout d'une commande lance la fonction
{                                                                                                                                                  //ajouterCommande()
    ajouterCommande();
});

$("table").delegate('.ligneTableauCommandes', 'click', function() //quand on clique sur une ligne du tableau commandes on redirige vers la page du détail de cette 
{                                                                                                                                                   //commande
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

$(".modal").on('click', '#validerLigne', function() //quand on clique sur valider dans le formulaire d'ajout d'une ligne commande lance la fonction ajouterLigne()
{
    afficher_dernier_produit = true;
    reference_dernier_produit = $("#referenceProduit").val();
    ajouterLigne();
});

$("table").delegate('.supprimer', 'click', function() //quand on clique sur la corbeille dans le tableau de détail d'une commande, supprimer la ligne et lance la 
{                                                                                               //fonction supprimerLigneCommande
    if(confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) 
    {
        $('#tableauDetailCommande').DataTable().row( $(this).parents('tr') ).remove().draw();
        var code_produit = $(this).attr('id').split('supprimer').join('');
        supprimerLigneCommande(code_produit);
    } 
});

$("table").delegate('.ligneDetailCommande', 'click', function() //quand on clique dans une ligne du tableau détail commande, récupère les valeurs de la ligne a 
{                                                               //modifier et lance la fonction formulaireModification
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

    $(".modal").on('click', "#validerModificationLigne", function() //si on clique sur le bouton valider du formulauire de modification lance la fonction 
    {                                                                                                           //modifierLigneCommande
        modifierLigneCommande(valeur_ligne[0]);
    });
});

$(".boutonsDetailCommande").on('click', '#cloturerCommande', function() // quand on clique sur le bouton "cloturer" affiche un message de demande de confirmation
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
 
$("#tableauCommande").on('click', '.supprimerCommande', function() //quand on clique sur la corbeille dans le tableau des commandes récupère le numéro de la commande
{                                                                   //et lance la fonction supprimerCommande apres avoir affiché un message de demande de confirmation
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

$("#tableauCommande").on('click', '.modifier', function() //quand on clique sur le crayon dans le tableau des commandes, récupère le numéro de la commande et lance  
{                                                         // la fonction afficherDetailCommande
    var numero_commande = $(this).attr('id').replace('modifier', '');
    afficherDetailCommande(numero_commande, recupererDossierClient(id_inverse));
});

$(".modal").on('click', '#validerModificationCommande', function() //quand on clique sur le bouton valider du formulaire de modification d'une commande
{                                                                  //lance la fonction modifierCommande()
    modifierCommande($("#numero_commande").html());
});

$(".modal").on('shown.bs.modal', function() //quand la modale d'ajout d'une ligne produit s'ouvre, on met le curseur dans l'input référence produit
{
    $("#referenceProduit").focus();
});

$("#entetePageCommande").on('click', '#fermerPage', function() // quand on clique sur le bouton rouge de fermeture de la page dans la page "mon panier" ou 
{                                                              // la page contenant le tableau des commandes, ferme la fenêtre courante
    window.close();
});

$("#afficherFormAjoutProduit").on('click', function() //quand on clique sur le formulaire d'ajout d'une ligne la variable formulaire_actif prend la valeur
{                                                                       //"ajouter"
    formulaire_actif = "ajouter";
});

$(".ligneDetailCommande").on('click', function()//quand on clique sur le formulaire de modification d'une ligne la variable formulaire_actif prend la valeur
{                                                   //"modifier"
    formulaire_actif = "modifier";
});


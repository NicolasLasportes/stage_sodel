<?php

namespace App\Http\Controllers;

use App\Commande;

use Illuminate\Http\Request;

class tableauCommande extends Controller
{
    public function obtenirCommande($id_commande)
    {
        $commande = Commande::where('id_commande', $id_commande)->get();

        return $commande;
    }

    public function obtenirCommandesClient($id_client)
    {
        $commandes = Commande::where('id_client', $id_client)->get();

        return $commandes;
    }

    public function afficherTableauCommandes()
    {
        return view("tableauCommande");
    }

    public function redirectionDetailCommande(Request $request)
    {
        if(isset($_POST['envoyer_id_commande']))
        {
            $id_commande = $request->input('id_commande');
            echo $id_commande;
        }
        //return redirect('/tableauCommande' . $id_commande);
    }
}
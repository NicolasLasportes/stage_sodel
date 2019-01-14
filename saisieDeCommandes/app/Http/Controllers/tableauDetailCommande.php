<?php

namespace App\Http\Controllers;

use App\Contenir;
use App\Produit;
use App\Stock;

use Illuminate\Http\Request;

class tableauDetailCommande extends Controller
{
    public function afficherDetailCommande($id)
    {
        return view('tableauDetailCommande', ["idCommande" => $id]);
    }

    public function obtenirProduixCommande($id_commande)
    {
        $listeProduits = Contenir::where('id_commande', $id_commande)->get();
        return $listeProduits;
    }

    public function obtenirProduit($id_produit)
    {
        $produit = Produit::where("id_produit", $id_produit)->get();
        return $produit;
    }

    public function obtenirStockProduit($id_produit)
    {
        $stock = Stock::where("id_produit", $id_produit)->get();
        return $stock;
    }
}

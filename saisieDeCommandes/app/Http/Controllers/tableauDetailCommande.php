<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class tableauDetailCommande extends Controller
{
    public function afficherDetailCommande($id)
    {
        return view('tableauDetailCommande', ["idCommande" => $id]);
    }
}

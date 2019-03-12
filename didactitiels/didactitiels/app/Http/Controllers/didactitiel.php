<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use App\didactp1;

class didactitiel extends Controller
{
    public function accueil()
    {
        //$didactitiels = didactp1::all();
        return view('didactitiel');//->with('didactitiels', $didactitiels);
    }

    public function recupererDidactitiels()
    {
        include "../../include/connexion.php";
        $listeDidactitiels = [];
        $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'D'";
        $resultat = odbc_Exec($conn, $sql);

        while(odbc_fetch_row($resultat))
        {
            $id = odbc_result($resultat, "DI_ID");
            $intitule = trim(odbc_result($resultat, "DILIBEL"));
            $pdf = trim(odbc_result($resultat, "DINPDF"));
            $excel = trim(odbc_result($resultat, "DINEXL"));
            $excel2 = trim(odbc_result($resultat, "DINEXL2"));
            $commentaire = trim(odbc_result($resultat, "DICOMM"));
            $affichageJson = [
                "id" => $id,
                "intitule" => utf8_encode($intitule),
                "pdf" => $pdf,
                "fichier" => $excel,
                "fichier2" => $excel2,
                "commentaire" => utf8_encode($commentaire)
            ];

            array_push($listeDidactitiels, $affichageJson);
        }
        
        return $listeDidactitiels;
    }

    public function ajouter(Request $request)
    {
        $datas = $request->all();
        $fichier = $datas['fichier'];
        //$formData = $datas['formData'];
        return [
            "fichier" => $fichier
            //"formData" => $formData
        ];    
    }
}

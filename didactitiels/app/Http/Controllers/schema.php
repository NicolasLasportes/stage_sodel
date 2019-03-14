<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class schema extends Controller
{
    public function recupererSchemas()
    {
        include "../../include/connexion.php";
        $listeDidactitiels = [];
        $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'S'";
        $resultat = odbc_Exec($conn, $sql);

        while(odbc_fetch_row($resultat))
        {
            $id = odbc_result($resultat, "DI_ID");
            $intitule = trim(odbc_result($resultat, "DILIBEL"));
            $pdf = trim(odbc_result($resultat, "DINPDF"));
            $schema = trim(odbc_result($resultat, "DINEXL"));
            $schema2 = trim(odbc_result($resultat, "DINEXL2"));
            $commentaire = trim(odbc_result($resultat, "DICOMM"));
            $affichageJson = [
                "id" => $id,
                "intitule" => utf8_encode($intitule),
                "pdf" => $pdf,
                "fichier" => $schema,
                "fichier2" => $schema2,
                "commentaire" => utf8_encode($commentaire)
            ];

            array_push($listeDidactitiels, $affichageJson);
        }
        
        return $listeDidactitiels;
    }
}

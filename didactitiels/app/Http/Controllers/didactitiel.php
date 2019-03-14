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

    public function recupererDidactitiels(Request $request)
    {
        include "../../include/connexion.php";
        $type = $request->input('type');
        if($type === "didactitiels")
        {
            $listeDidactitiels = [];
            $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'D'";
        }
        else
        {
            $listeDidactitiels = [];
            $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'S'";
        }

        $resultat = odbc_Exec($conn, $sql);

        while(odbc_fetch_row($resultat))
        {
            $id = odbc_result($resultat, "DI_ID");
            $intitule = trim(odbc_result($resultat, "DILIBEL"));
            $pdf = trim(odbc_result($resultat, "DINPDF"));
            $excel = trim(odbc_result($resultat, "DINEXL"));
            $excel2 = trim(odbc_result($resultat, "DINEXL2"));
            $numeroPDF = trim(odbc_result($resultat, "DINUMP"));
            $commentaire = trim(odbc_result($resultat, "DICOMM"));
            
            $affichageJson = [
                "id" => $id,
                "intitule" => utf8_encode($intitule),
                "pdf" => $pdf,
                "fichier" => $excel,
                "fichier2" => $excel2,
                "numeroPdf" => $numeroPDF,
                "commentaire" => utf8_encode($commentaire)
            ];

            array_push($listeDidactitiels, $affichageJson);
        }
        
        return $listeDidactitiels;
        
    }

    public function ajouter(Request $request)
    {
        include "../../include/connexion.php";
        $dossier = 'files';
        $intitule = $request->input('intitule');
        $commentaire = $request->input('commentaire');
        $type = $request->input('type');
        $numero = $request->input('numeroDevis');
        //on récupère le pdf
        $pdf = $request->file('pdf');
        //on récupère le fichier ressource 1
        $fichier1 = $request->file('excelOuSchema');
        //on récupère le fichier ressource 2
        $fichier2 = $request->file('excelOuSchema2');

        if($pdf != null)
        {
            $nomPdf =  $pdf->getClientOriginalName();
            $extension = $pdf->getClientOriginalExtension();
            $nomDuPdf =  $nomPdf;
            $pdf->move($dossier, $nomDuPdf);
        }
        else
        {
            $nomPdf = "";
        }

        if($fichier1 != null)
        {
            $nomFichier1 =  $fichier1->getClientOriginalName();
            $extension = $fichier1->getClientOriginalExtension();
            $nomDuFichier1 =  $nomFichier1;
            $fichier1->move($dossier, $nomDuFichier1);
        }
        else
        {
            $nomFichier1 = "";
        }

        if($fichier2 != null)
        {
            $nomFichier2 =  $fichier2->getClientOriginalName();
            $extension = $fichier2->getClientOriginalExtension();
            $nomDuFichier2 =  $nomFichier2;
            $fichier2->move($dossier, $nomDuFichier2);
        }
        else
        {
            $nomFichier2 = "";
        }
        $intitule = str_replace("'", "''", $intitule);
        $commentaire = str_replace("'", "''", $commentaire);
        $sql = "INSERT INTO FILWEBSOD.DIDACTP1 VALUES ('$type', '$intitule', '$nomPdf', '$nomFichier1', '$nomFichier2', '$commentaire', DEFAULT, '$numero')";
        odbc_Exec($conn, $sql);
        if($type == "D")
        {
            $page = "didactitiel";
        }
        else
        {
            $page = "schema";
        }
        return redirect('/' . $page);
    }

    public function supprimer(Request $request)
    {
        $fichierASupprimer = $request->input('');
    }

    public function ajouterDidactitiels(Request $request)
    {
        include "../../include/connexion.php";
        $pdf = $request->file('pdf');
        $nomPdf =  $pdf->getClientOriginalName();
        $extension = $pdf>getClientOriginalExtension();
        $pdf->move($dossier, $nomPdf);
        return [
            "ca" => "c'est bien pass"
        ];
    }
}
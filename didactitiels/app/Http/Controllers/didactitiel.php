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
            $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'D' ORDER BY DI_ID DESC";
        }
        else
        {
            $listeDidactitiels = [];
            $sql = "SELECT * FROM FILWEBSOD.DIDACTP1 WHERE DICODE = 'S' ORDER BY DI_ID DESC";
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
            $nomPdf = $pdf->getClientOriginalName();
            $pdf->move($dossier, $nomPdf);
        }
        else
        {
            $nomPdf = "";
        }

        if($fichier1 != null)
        {
            $nomFichier1 = $fichier1->getClientOriginalName();
            $fichier1->move($dossier, $nomFichier1);
        }
        else
        {
            $nomFichier1 = "";
        }

        if($fichier2 != null)
        {
            $nomFichier2 = $fichier2->getClientOriginalName();
            $fichier2->move($dossier, $nomFichier2);
        }
        else
        {
            $nomFichier2 = "";
        }
        if($numero == "")
        {
            $numero = 0;
        }
        $intitule = mb_convert_encoding(str_replace("'", "''", $intitule), "iso-8859-1", "UTF-8");
        $commentaire = mb_convert_encoding(str_replace("'", "''", $commentaire), "iso-8859-1", "UTF-8");
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

    public function modifier(Request $request)
    {
        include "../../include/connexion.php";
        $dossier = 'files';
        $id = $request->input('id');
        $intitule = $request->input('intitule');
        $pdf = $request->file('pdf');
        $excelOuSchema = $request->file('excelOuSchema');
        $excelOuSchema2 = $request->file('excelOuSchema2');
        $commentaire = $request->input('commentaire');
        $numeroDevis = $request->input('numeroDevis');
        $page = $request->input('type');
        
        if($pdf == null)
        {
            $champPdf = "";
        }
        else
        {
            $nomPdf = $pdf->getClientOriginalName();
            $pdf->move($dossier, $nomPdf);
            $champPdf = "DINPDF = '$nomPdf',";
        }
        
        if($excelOuSchema == null)
        {
            $champFichier1 = "";
        }
        else
        {
            $nomFichier1 = $excelOuSchema->getClientOriginalName();
            $excelOuSchema->move($dossier, $nomFichier1);
            $champFichier1 = "DINEXL = '$nomFichier1',";
        }

        if($excelOuSchema2 == null)
        {
            $champFichier2 = "";
        }
        else
        {
            $nomFichier2 = $excelOuSchema2->getClientOriginalName();
            $excelOuSchema2->move($dossier, $nomFichier2);
            $champFichier2 = "DINEXL2 = '$nomFichier2',";
        }

        if($numeroDevis == "")
        {
            $numeroDevis = 0;
        }
        $intitule = mb_convert_encoding(str_replace("'", "''", $intitule), "iso-8859-1", "UTF-8");
        $commentaire = mb_convert_encoding(str_replace("'", "''", $commentaire), "iso-8859-1", "UTF-8");
        $sql = "UPDATE FILWEBSOD.DIDACTP1 SET DILIBEL = '$intitule', $champPdf $champFichier1 $champFichier2 DICOMM = '$commentaire', DINUMP = '$numeroDevis' 
        WHERE DI_ID = '$id'";
        odbc_Exec($conn, $sql);

        if($page == "didactitiels")
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

    // public function ajouterDidactitiels(Request $request)
    // {
    //     include "../../include/connexion.php";
    //     $pdf = $request->file('pdf');
    //     $nomPdf =  $pdf->getClientOriginalName();
    //     $extension = $pdf>getClientOriginalExtension();
    //     $pdf->move($dossier, $nomPdf);
    //     return [
    //         "ca" => "c'est bien pass"
    //     ];
    // }
}
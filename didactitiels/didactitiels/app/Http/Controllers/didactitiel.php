<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use App\didactp1;

class didactitiel extends Controller
{
    public function recupererDidactitiels()
    {
        //$didactitiels = didactp1::all();
        return view('didactitiel');//->with('didactitiels', $didactitiels);
    }
}

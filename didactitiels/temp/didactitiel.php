<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\didactitiels;

class didactitiel extends Controller
{
    public function recupererDidactitiels()
    {
        $didactitiels = didactitiels::all();
        return view('didactitiel')->with('didactitiels', $didactitiels);
    }
}

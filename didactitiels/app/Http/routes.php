<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/{page}', "didactitiel@accueil");

Route::post("/api/schemas", "schema@recupererSchemas");

Route::post("/api/didactitiels", "didactitiel@recupererDidactitiels");

Route::post("/api/ajouter/didactitiel", "didactitiel@ajouter");

//Route::post("/api/ajouter", "didactitiel@ajouterDidactitiels");

Route::post("/api/modifier", "didactitiel@modifier");

Route::post("/api/supprimer", "didactitiel@supprimer");
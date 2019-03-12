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

Route::get('/{id}', "didactitiel@accueil");

Route::get("/api/schemas", "schema@recupererSchemas");

Route::get("/api/didactitiels", "didactitiel@recupererDidactitiels");

Route::get("/api/ajouter/didactitiel", "didactitiel@ajouter");
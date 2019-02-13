<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Commandes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">  
    </head>
    <body>
       <h1>Ceci est un email envoyé avec laravel</h1>
       <div>Ceci est le contenu de mon email</div>
       <div>{{ $data }}</div>
    </body>
</html>
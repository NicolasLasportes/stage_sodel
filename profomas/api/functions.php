<?php

function echappementChaineCaracteres($chaineDeCaracteres)
{
    $chaineDeCaracteresEchappe = [];
    $chaineDeCaracteres = str_split($chaineDeCaracteres);

    foreach($chaineDeCaracteres as $caractere)
    {
        if($caractere === "'")
        {
            $caractere = $caractere . $caractere;
        }
        array_push($chaineDeCaracteresEchappe, $caractere);
    }

    return implode($chaineDeCaracteresEchappe);
}

?>
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PDO Fetch Style
    |--------------------------------------------------------------------------
    |
    | By default, database results will be returned as instances of the PHP
    | stdClass object; however, you may desire to retrieve records in an
    | array format for simplicity. Here you can tweak the fetch style.
    |
    */

    'fetch' => PDO::FETCH_CLASS,

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
        ],

        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => '',
            'strict' => false,
            'engine' => null,
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'schema' => 'public',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer set of commands than a typical key-value systems
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'cluster' => false,

        'default' => [
            'host' => env('REDIS_HOST', 'localhost'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => 0,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | DB2 Databases
    |--------------------------------------------------------------------------
    */

    'ibmi' => [
        'driver' => 'db2_ibmi_odbc',
        // or 'db2_ibmi_ibm' / 'db2_zos_odbc' / 'db2_expressc_odbc
        'driverName' => '{IBM i Access ODBC Driver}',
        // or '{iSeries Access ODBC Driver}' / '{IBM i Access ODBC Driver 64-bit}'
        'host' => 'AS400',
        'username' => 'com11',
        'password' => 'pcs400',
        'database' => 'WRKRDBDIRE entry',
        'prefix' => '',
        'schema' => 'default schema',
        'port' => 50000,
        'date_format' => 'Y-m-d H:i:s',
        // or 'Y-m-d H:i:s.u' / 'Y-m-d-H.i.s.u'...
        'odbc_keywords' => [
            'SIGNON' => 3,
            'SSL' => 0,
            'CommitMode' => 2,
            'ConnectionType' => 0,
            'DefaultLibraries' => '',
            'Naming' => 0,
            'UNICODESQL' => 0,
            'DateFormat' => 5,
            'DateSeperator' => 0,
            'Decimal' => 0,
            'TimeFormat' => 0,
            'TimeSeparator' => 0,
            'TimestampFormat' => 0,
            'ConvertDateTimeToChar' => 0,
            'BLOCKFETCH' => 1,
            'BlockSizeKB' => 32,
            'AllowDataCompression' => 1,
            'CONCURRENCY' => 0,
            'LAZYCLOSE' => 0,
            'MaxFieldLength' => 15360,
            'PREFETCH' => 0,
            'QUERYTIMEOUT' => 1,
            'DefaultPkgLibrary' => 'QGPL',
            'DefaultPackage' => 'A /DEFAULT(IBM),2,0,1,0',
            'ExtendedDynamic' => 0,
            'QAQQINILibrary' => '',
            'SQDIAGCODE' => '',
            'LANGUAGEID' => 'ENU',
            'SORTTABLE' => '',
            'SortSequence' => 0,
            'SORTWEIGHT' => 0,
            'AllowUnsupportedChar' => 0,
            'CCSID' => 819,
            'GRAPHIC' => 0,
            'ForceTranslation' => 0,
            'ALLOWPROCCALLS' => 0,
            'DB2SQLSTATES' => 0,
            'DEBUG' => 0,
            'TRUEAUTOCOMMIT' => 0,
            'CATALOGOPTIONS' => 3,
            'LibraryView' => 0,
            'ODBCRemarks' => 0,
            'SEARCHPATTERN' => 1,
            'TranslationDLL' => '',
            'TranslationOption' => 0,
            'MAXTRACESIZE' => 0,
            'MultipleTraceFiles' => 1,
            'TRACE' => 0,
            'TRACEFILENAME' => '',
            'ExtendedColInfo' => 0,
        ],
        'options' => [
            PDO::ATTR_CASE => PDO::CASE_LOWER,
            PDO::ATTR_PERSISTENT => false,
            //PDO::I5_ATTR_DBC_SYS_NAMING => false,
            //PDO::I5_ATTR_COMMIT => PDO::I5_TXN_NO_COMMIT,
            //PDO::I5_ATTR_JOB_SORT => false,
            //PDO::I5_ATTR_DBC_LIBL => '',
            //PDO::I5_ATTR_DBC_CURLIB => '',
        ]
    ],

];

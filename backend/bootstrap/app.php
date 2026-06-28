<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/*
|--------------------------------------------------------------------------
| Laravel 11 application bootstrap.
|--------------------------------------------------------------------------
| The important bit for this project is `api: __DIR__.'/../routes/api.php'`,
| which registers the /api routes. CORS is applied automatically via
| config/cors.php in Laravel 11.
*/

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // CORS is handled by the framework's HandleCors middleware,
        // which reads config/cors.php. Nothing extra needed here.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing (CORS) Configuration
|--------------------------------------------------------------------------
| Allows the React dev server (Vite, default :5173) to call the API.
| Add your production frontend origin to `allowed_origins` when you deploy.
*/

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * Local dev, plus whatever FRONTEND_URL is set to on the server. Set that
     * to your Vercel production domain — the patterns below already cover
     * Vercel's generated preview URLs, so branch deploys work without listing
     * each one.
     */
    'allowed_origins' => array_values(array_filter([
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        env('FRONTEND_URL'),
    ])),

    'allowed_origins_patterns' => [
        // https://<project>-<hash>-<scope>.vercel.app
        '#^https://[a-z0-9-]+\.vercel\.app$#i',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set true only if you switch to cookie-based (Sanctum) auth.
    'supports_credentials' => false,

];

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

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        // 'https://your-portfolio-domain.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set true only if you switch to cookie-based (Sanctum) auth.
    'supports_credentials' => false,

];

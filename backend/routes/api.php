<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\BootstrapController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\JourneyController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\Admin\AboutController as AdminAboutController;
use App\Http\Controllers\Admin\CvController as AdminCvController;
use App\Http\Controllers\Admin\CvPhotoController as AdminCvPhotoController;
use App\Http\Controllers\Admin\JourneyController as AdminJourneyController;
use App\Http\Controllers\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Admin\OverviewController as AdminOverviewController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProfilePhotoController as AdminProfilePhotoController;
use App\Http\Controllers\Admin\PricingController as AdminPricingController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\TechnologyController as AdminTechnologyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| In Laravel 11+, run `php artisan install:api` once so this file is loaded
| and Sanctum is wired up.
*/

/* ----------------------------- Public ----------------------------- */
Route::middleware(\App\Http\Middleware\PublicCacheHeaders::class)->group(function () {
    Route::get('/bootstrap', [BootstrapController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::get('/journey', [JourneyController::class, 'index']);
    Route::get('/about', [AboutController::class, 'index']);
    Route::get('/technologies', [TechnologyController::class, 'index']);
    Route::get('/pricing', [PricingController::class, 'index']);
    Route::get('/cv', [CvController::class, 'show']);
Route::get('/cv/photo', [CvController::class, 'photo']);
});
Route::post('/contact', [ContactController::class, 'store']);

/* ----------------------------- Auth ------------------------------- */
Route::post('/login', [AuthController::class, 'login']);

/* -------------------- Admin (Sanctum protected) ------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        // Dashboard overview (counts + recents, one request)
        Route::get('/overview', [AdminOverviewController::class, 'index']);

        // Profile photo (upload / remove)
        Route::post('/profile-photo', [AdminProfilePhotoController::class, 'store']);
        Route::delete('/profile-photo', [AdminProfilePhotoController::class, 'destroy']);

        // CV photo (dedicated, more formal shot — falls back to profile photo)
        Route::post('/cv-photo', [AdminCvPhotoController::class, 'store']);
        Route::delete('/cv-photo', [AdminCvPhotoController::class, 'destroy']);

        // Messages
        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::get('/messages/{message}', [AdminMessageController::class, 'show']);
        Route::patch('/messages/{message}', [AdminMessageController::class, 'update']);
        Route::delete('/messages/{message}', [AdminMessageController::class, 'destroy']);

        // Projects (full CRUD + reorder)
        Route::post('/projects/reorder', [AdminProjectController::class, 'reorder']);
        Route::get('/projects', [AdminProjectController::class, 'index']);
        Route::post('/projects', [AdminProjectController::class, 'store']);
        Route::get('/projects/{project}', [AdminProjectController::class, 'show']);
        Route::match(['put', 'patch'], '/projects/{project}', [AdminProjectController::class, 'update']);
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy']);

        // Blog posts (full CRUD) — bound by id in admin.
        Route::get('/posts', [AdminPostController::class, 'index']);
        Route::post('/posts', [AdminPostController::class, 'store']);
        Route::get('/posts/{post:id}', [AdminPostController::class, 'show']);
        Route::match(['put', 'patch'], '/posts/{post:id}', [AdminPostController::class, 'update']);
        Route::delete('/posts/{post:id}', [AdminPostController::class, 'destroy']);

        // Journey milestones (full CRUD + reorder)
        Route::post('/journey/reorder', [AdminJourneyController::class, 'reorder']);
        Route::get('/journey', [AdminJourneyController::class, 'index']);
        Route::post('/journey', [AdminJourneyController::class, 'store']);
        Route::get('/journey/{milestone}', [AdminJourneyController::class, 'show']);
        Route::match(['put', 'patch'], '/journey/{milestone}', [AdminJourneyController::class, 'update']);
        Route::delete('/journey/{milestone}', [AdminJourneyController::class, 'destroy']);

        // About page content
        Route::get('/about', [AdminAboutController::class, 'show']);
        Route::put('/about', [AdminAboutController::class, 'update']);

        // Technologies (grouped stack)
        Route::get('/technologies', [AdminTechnologyController::class, 'show']);
        Route::put('/technologies', [AdminTechnologyController::class, 'update']);

        // Pricing (tiers + FAQ)
        Route::get('/pricing', [AdminPricingController::class, 'show']);
        Route::put('/pricing', [AdminPricingController::class, 'update']);

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // CV / Resume
        Route::get('/cv', [AdminCvController::class, 'show']);
        Route::put('/cv', [AdminCvController::class, 'update']);
    });
});

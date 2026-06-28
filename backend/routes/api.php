<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Admin\CvController as AdminCvController;
use App\Http\Controllers\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| In Laravel 11+, run `php artisan install:api` once so this file is loaded
| and Sanctum is wired up.
*/

/* ----------------------------- Public ----------------------------- */
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/cv', [CvController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);

/* ----------------------------- Auth ------------------------------- */
Route::post('/login', [AuthController::class, 'login']);

/* -------------------- Admin (Sanctum protected) ------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
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

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // CV / Resume
        Route::get('/cv', [AdminCvController::class, 'show']);
        Route::put('/cv', [AdminCvController::class, 'update']);
    });
});

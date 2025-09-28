<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\RepairJobController;
use App\Http\Controllers\JobStatusController;
use App\Http\Controllers\ApiAuthController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\JobNoteController;
Route::get('/health', HealthController::class);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Token auth endpoints
Route::post('/auth/login', [ApiAuthController::class, 'login']);
Route::post('/auth/logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    // Shared read-only endpoints
    Route::get('job-statuses', [JobStatusController::class, 'index']);
    // Admin-only routes
    Route::middleware(\App\Http\Middleware\RoleMiddleware::class.':Admin')->group(function () {
        Route::apiResource('users', UserManagementController::class);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('vehicles', VehicleController::class);
        Route::apiResource('job-statuses', JobStatusController::class)->only(['store','update','destroy']);
        Route::apiResource('repair-jobs', RepairJobController::class)->only(['index','store','update','destroy','show']);
        Route::get('repair-jobs/{repair_job}/notes', [JobNoteController::class, 'index']);
        Route::post('repair-jobs/{repair_job}/notes', [JobNoteController::class, 'store']);
        Route::delete('repair-jobs/{repair_job}/notes/{note}', [JobNoteController::class, 'destroy']);
    });

    // Mechanic routes
    Route::middleware(\App\Http\Middleware\RoleMiddleware::class.':Mechanic')->group(function () {
        Route::get('my-jobs', [RepairJobController::class, 'index']);
        Route::patch('repair-jobs/{repair_job}/status', [RepairJobController::class, 'updateStatus']);
        Route::get('repair-jobs/{repair_job}/notes', [JobNoteController::class, 'index']);
        Route::post('repair-jobs/{repair_job}/notes', [JobNoteController::class, 'store']);
    });
});

<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiseasePredictionController;
use App\Http\Controllers\DiseaseInformationController;
use App\Http\Controllers\AuthController;

Route::get('/hello', function () {
    return 'Hello from API routes!';
});

Route::middleware('api')->prefix('v1')->group(function () {
    // Prediction & symptoms
    Route::post('/predict', [DiseasePredictionController::class, 'diagnose']);
    Route::get('/symptoms', [DiseasePredictionController::class, 'getSymptoms']);
    Route::get('/disease-info/{disease}', [DiseaseInformationController::class, 'getInfo']);

    // Auth (public)
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    // Auth (protected)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'user']);
    });
});

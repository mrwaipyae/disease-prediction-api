<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiseasePredictionController;
use App\Http\Controllers\DiseaseInformationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AppointmentController;

Route::get('/hello', function () {
    return 'Hello from API routes!';
});

Route::middleware('api')->prefix('v1')->group(function () {
    // Prediction & symptoms
    Route::get('/symptoms', [DiseasePredictionController::class, 'getSymptoms']);
    Route::get('/disease-info/{disease}', [DiseaseInformationController::class, 'getInfo']);
    Route::get('/accuracy', [DiseasePredictionController::class, 'calculateAccuracy']);



    // Auth (public)
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', [AuthController::class, 'user']);
        // Route::get('/users', [UserController::class, 'index']);
        Route::post('logout', [AuthController::class, 'logout']); 
        Route::post('/predict', [DiseasePredictionController::class, 'diagnose']);

        Route::get('/prediction-history', [DiseasePredictionController::class, 'getPredictionHistory']);

    });
     Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/doctors', [DoctorController::class, 'index']);
        Route::post('/doctors', [DoctorController::class, 'store']);
        Route::put('/doctors/{id}', [DoctorController::class, 'update']);
        Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
    });
});

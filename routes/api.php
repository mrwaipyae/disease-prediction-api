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
    Route::post('/predict', [DiseasePredictionController::class, 'diagnose']);
    Route::get('/symptoms', [DiseasePredictionController::class, 'getSymptoms']);
    Route::get('/disease-info/{disease}', [DiseaseInformationController::class, 'getInfo']);

    // Auth (public)
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // User profile
        Route::get('user', [AuthController::class, 'user']);
        Route::post('logout', [AuthController::class, 'logout']);


        // Doctor management (admin only)
        // Route::middleware('role:admin')->prefix('doctors')->group(function () {
        //     Route::get('/', [DoctorController::class, 'index']);
        //     Route::post('/', [DoctorController::class, 'store']);
        //     Route::get('/{doctor}', [DoctorController::class, 'show']);
        //     Route::put('/{doctor}', [DoctorController::class, 'update']);
        //     Route::delete('/{doctor}', [DoctorController::class, 'destroy']);
        // });

        // Appointments (authenticated users)
        // Route::prefix('appointments')->group(function () {
        //     Route::get('/', [AppointmentController::class, 'index']);
        //     Route::post('/', [AppointmentController::class, 'store']);
        //     Route::get('/{appointment}', [AppointmentController::class, 'show']);
        //     Route::put('/{appointment}', [AppointmentController::class, 'update']);
        //     Route::delete('/{appointment}', [AppointmentController::class, 'destroy']);
        // });

        Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        });
    });
});

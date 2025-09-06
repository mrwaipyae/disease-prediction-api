<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiseasePredictionController;
use App\Http\Controllers\DiseaseInformationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;

Route::get('/hello', function () {
    return 'Hello from API routes!';
});
Route::get('/evaluate-model', [DiseasePredictionController::class, 'evaluateModel']);

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
    Route::get('/users', function () {
        return response()->json(['message' => 'Admin route working']);
    });
});

});





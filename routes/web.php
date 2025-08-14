<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiseasePredictionController;


Route::get('/{any}', function () {
    return view('welcome'); // or whatever Blade view you're rendering
})->where('any', '.*');

